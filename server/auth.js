import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AppError, email } from './service.js';

export const hash = value => createHash('sha256').update(value).digest('hex');
export class Mailer {
  constructor(config) { this.config = config; }
  async send(address, code) {
    if (this.config.mode === 'local') {
      if (this.config.production) throw new Error('Local mailbox is unavailable in production.');
      const dir = join(this.config.dataDir, 'mailbox'); await mkdir(dir, { recursive: true });
      await writeFile(join(dir, `${hash(address).slice(0, 16)}.txt`), `To: ${address}\nWorkInProgress login code: ${code}\nExpires in 10 minutes.\n`, { mode: 0o600 });
      return;
    }
    if (this.config.mode !== 'resend' || !this.config.apiKey || !this.config.from) throw new Error('Email sender is not configured.');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${this.config.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: this.config.from, to: [address], subject: 'Your WorkInProgress login code', text: `Your login code is ${code}. It expires in 10 minutes. Do not share it.` }), signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error('Email delivery failed.');
  }
}

export class Auth {
  constructor(store, mailer, clock = () => Date.now()) { this.s = store; this.mailer = mailer; this.clock = clock; this.requests = new Map(); }
  limit(key, max, period) {
    const time = this.clock(); let entry = this.requests.get(key);
    if (!entry || entry.until <= time) entry = { count: 0, until: time + period };
    entry.count++; this.requests.set(key, entry);
    for (const [id, item] of this.requests) if (item.until < time) this.requests.delete(id);
    if (entry.count > max) throw new AppError('Too many attempts. Please try again later.', 429);
  }
  async request(address, ip) {
    const normalized = email(address); this.limit(`ip:${ip}`, 20, 3600000); this.limit(`email:${normalized}`, 5, 600000);
    const user = this.s.all('users').find(u => u.email === normalized && u.active);
    if (user) {
      const old = this.s.get('otps', normalized);
      if (old && old.sentAt + 60000 > this.clock()) throw new AppError('Wait one minute before requesting another code.', 429);
      const code = String(randomInt(100000, 1000000)), salt = randomBytes(24).toString('hex');
      const otp = { id: normalized, user: user.id, digest: hash(`${salt}:${code}`), salt, expires: this.clock() + 600000, sentAt: this.clock(), attempts: 0 };
      this.s.put('otps', otp);
      try { await this.mailer.send(normalized, code); }
      catch { this.s.remove('otps', normalized); throw new AppError('Login email could not be sent. Please contact the administrator.', 503); }
    }
    return { message: 'If this email has access, a login code has been sent.', localMailbox: this.mailer.config?.mode === 'local' };
  }
  verify(address, code, ip) {
    const normalized = email(address); this.limit(`verify:${ip}`, 30, 600000);
    const otp = this.s.get('otps', normalized), user = otp && this.s.get('users', otp.user);
    if (!otp || !user?.active || otp.expires <= this.clock() || otp.attempts >= 5) throw new AppError('Invalid or expired code.', 401);
    otp.attempts++; this.s.put('otps', otp);
    const candidate = hash(`${otp.salt}:${String(code)}`);
    if (!/^\d{6}$/.test(String(code)) || !timingSafeEqual(Buffer.from(otp.digest), Buffer.from(candidate))) throw new AppError('Invalid or expired code.', 401);
    this.s.remove('otps', normalized);
    const token = randomBytes(32).toString('base64url');
    this.s.put('sessions', { id: hash(token), user: user.id, expires: this.clock() + 8 * 3600000, createdAt: this.clock() });
    return token;
  }
  authenticate(cookie) {
    const token = /(?:^|;\s*)wip_session=([^;]+)/.exec(cookie || '')?.[1];
    const session = token && this.s.get('sessions', hash(token));
    if (!session || session.expires <= this.clock()) throw new AppError('Please sign in.', 401);
    const user = this.s.get('users', session.user);
    if (!user?.active) throw new AppError('Please sign in.', 401);
    return user;
  }
  logout(cookie) { const token = /(?:^|;\s*)wip_session=([^;]+)/.exec(cookie || '')?.[1]; if (token) this.s.remove('sessions', hash(token)); }
  cleanup() {
    for (const s of this.s.all('sessions')) if (s.expires <= this.clock()) this.s.remove('sessions', s.id);
    for (const o of this.s.all('otps')) if (o.expires <= this.clock()) this.s.remove('otps', o.id);
  }
}
