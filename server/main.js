import http from 'node:http';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Store } from './store.js';
import { Service, AppError } from './service.js';
import { Auth, Mailer } from './auth.js';
import { Files } from './files.js';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
export function createApp(config = {}) {
  const production = config.production ?? process.env.NODE_ENV === 'production';
  const dataDir = resolve(config.dataDir || process.env.DATA_DIR || join(root, 'runtime'));
  const origin = config.origin || process.env.APP_ORIGIN || 'http://127.0.0.1:3000';
  const mailMode = process.env.MAIL_MODE || 'local';
  if (production && (!origin.startsWith('https://') || mailMode === 'local')) throw new Error('Production requires HTTPS APP_ORIGIN and a real email sender.');
  mkdirSync(dataDir, { recursive: true });
  const store = config.store || new Store(join(dataDir, 'wip.sqlite'));
  const service = new Service(store, config.clock);
  const ownerEmail = config.ownerEmail || process.env.OWNER_EMAIL;
  if (!ownerEmail && !store.all('users').length) throw new Error('Set OWNER_EMAIL before starting.');
  if (ownerEmail) service.bootstrap(ownerEmail, process.env.OWNER_NAME);
  const mailer = config.mailer || new Mailer({ mode: mailMode, production, dataDir, apiKey: process.env.RESEND_API_KEY, from: process.env.MAIL_FROM });
  if (production && !config.mailer && (mailMode !== 'resend' || !process.env.RESEND_API_KEY || !process.env.MAIL_FROM)) throw new Error('Production email provider credentials and sender are required.');
  const auth = new Auth(store, mailer, config.authClock);
  const files = new Files(service, join(dataDir, 'uploads'), Number(process.env.UPLOAD_MAX_BYTES) || 5 * 1024 * 1024);
  const cookie = token => `wip_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${token ? 28800 : 0}${production ? '; Secure' : ''}`;
  const security = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'X-Frame-Options': 'DENY', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'", 'Cache-Control': 'no-store' };
  async function body(req) {
    if (!req.headers['content-type']?.startsWith('application/json')) throw new AppError('JSON body required.', 415);
    const chunks = []; let size = 0;
    for await (const chunk of req) { size += chunk.length; if (size > files.max * 1.4 + 16000) throw new AppError('Request too large.', 413); chunks.push(chunk); }
    try { const result = JSON.parse(Buffer.concat(chunks).toString()); if (!result || Array.isArray(result) || typeof result !== 'object') throw Error(); return result; } catch { throw new AppError('Invalid JSON.'); }
  }
  const server = http.createServer(async (req, res) => {
    const send = (status, value, headers = {}) => { res.writeHead(status, { ...security, 'Content-Type': 'application/json; charset=utf-8', ...headers }); res.end(JSON.stringify(value)); };
    try {
      const url = new URL(req.url, origin), path = url.pathname, method = req.method;
      if (method === 'GET' && path === '/health') return send(200, { ok: true });
      if (['POST', 'DELETE', 'PATCH', 'PUT'].includes(method)) {
        if (req.headers['x-wip-request'] !== '1' || req.headers.origin && req.headers.origin !== origin) throw new AppError('Request origin is not permitted.', 403);
      }
      if (method === 'POST' && path === '/api/auth/request') { const input = await body(req); return send(200, await auth.request(input.email, req.socket.remoteAddress)); }
      if (method === 'POST' && path === '/api/auth/verify') { const input = await body(req); const token = auth.verify(input.email, input.code, req.socket.remoteAddress); return send(200, { ok: true }, { 'Set-Cookie': cookie(token) }); }
      if (method === 'POST' && path === '/api/auth/logout') { auth.logout(req.headers.cookie); return send(200, { ok: true }, { 'Set-Cookie': cookie('') }); }
      if (path.startsWith('/api/')) {
        const actor = auth.authenticate(req.headers.cookie);
        if (method === 'GET' && path === '/api/state') return send(200, service.snapshot(actor));
        if (method === 'GET' && /^\/api\/files\/[^/]+$/.test(path)) { const { row, bytes } = files.download(actor, path.split('/').at(-1)); res.writeHead(200, { ...security, 'Content-Type': row.type, 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(row.name)}`, 'Content-Length': bytes.length }); return res.end(bytes); }
        if (method === 'GET' && path === '/api/audit') { if (!actor.owner) throw new AppError('Owner only.', 403); return send(200, store.all('audit')); }
        if (method === 'POST') {
          const input = await body(req), match = /^\/api\/projects\/([^/]+)(?:\/([^/]+))?(?:\/([^/]+))?$/.exec(path);
          if (match?.[2] === 'files') return send(201, files.upload(actor, match[1], input));
          const result = store.tx(() => {
            if (path === '/api/projects') return service.createProject(actor, input);
            if (path === '/api/departments') return service.addDepartment(actor, input);
            if (match) {
              const [, pid, action, id] = match;
              if (action === 'members') {
                if (id) return input.action === 'remove' ? service.removeMember(actor, pid, id) : service.editMember(actor, pid, id, input);
                return service.addMember(actor, pid, input);
              }
              if (['close', 'reopen', 'stage'].includes(action)) return service.transition(actor, pid, action, input);
              if (action === 'tasks') return service.createTask(actor, pid, input);
              if (action === 'updates') return service.update(actor, pid, input, req.headers['idempotency-key']);
              if (action === 'changes') return service.change(actor, pid, input);
              if (action === 'comments') return service.comment(actor, pid, input);
              if (action === 'status-requests') return service.requestStatus(actor, pid, input);
            }
            const task = /^\/api\/tasks\/([^/]+)\/(verify|acknowledge|supply)$/.exec(path);
            if (task) return task[2] === 'verify' ? service.verify(actor, task[1], input) : task[2] === 'supply' ? service.supply(actor, task[1], input) : service.acknowledge(actor, task[1], input);
            const change = /^\/api\/changes\/([^/]+)\/(decide|respond)$/.exec(path);
            if (change) return change[2] === 'decide' ? service.decide(actor, change[1], input) : service.accept(actor, change[1], input);
            const notification = /^\/api\/notifications\/([^/]+)\/read$/.exec(path);
            if (notification) { const n = store.get('notifications', notification[1]); if (!n || n.user !== actor.id) throw new AppError('Notification not found.', 404); return store.put('notifications', { ...n, read: true }); }
            throw new AppError('Endpoint not found.', 404);
          });
          return send(200, result ?? { ok: true });
        }
        throw new AppError('Endpoint not found.', 404);
      }
      const assets = { '/': ['index.html', 'text/html'], '/client.js': ['client.js', 'text/javascript'], '/assignment.js': ['assignment.js', 'text/javascript'], '/style.css': ['style.css', 'text/css'] };
      if (method === 'GET' && assets[path]) { const [file, type] = assets[path]; res.writeHead(200, { ...security, 'Content-Type': `${type}; charset=utf-8` }); return res.end(readFileSync(join(root, 'web', file))); }
      throw new AppError('Not found.', 404);
    } catch (error) { if (!error.status) console.error('Request failed:', error.name); send(error.status || 500, { error: error.status ? error.message : 'The request could not be completed.' }); }
  });
  const tick = () => { try { store.tx(() => { service.reminders(); auth.cleanup(); }); } catch (e) { console.error('Reminder job failed:', e.name); } };
  const interval = config.jobs === false ? null : setInterval(tick, 60000); interval?.unref();
  server.on('close', () => { if (interval) clearInterval(interval); if (!config.store) store.close(); });
  return { server, service, auth, store, files, tick };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const host = process.env.HOST || '127.0.0.1';
  if (process.env.NODE_ENV !== 'production' && !['127.0.0.1', 'localhost', '::1'].includes(host)) throw new Error('Development mode must bind to loopback. Configure production for shared access.');
  const app = createApp();
  app.server.listen(Number(process.env.PORT) || 3000, host, () => console.log(`WorkInProgress running at ${process.env.APP_ORIGIN || 'http://127.0.0.1:3000'} (${process.env.MAIL_MODE || 'local'} email mode)`));
}
