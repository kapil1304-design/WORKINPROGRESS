import { mkdirSync, writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { AppError, text } from './service.js';

export function detectType(bytes) {
  if (bytes.subarray(0, 5).equals(Buffer.from('%PDF-'))) return { type: 'application/pdf', ext: 'pdf' };
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return { type: 'image/png', ext: 'png' };
  if (bytes.length > 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return { type: 'image/jpeg', ext: 'jpg' };
  if (bytes.length > 12 && bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP') return { type: 'image/webp', ext: 'webp' };
  throw new AppError('Only PDF, JPEG, PNG and WebP attachments are allowed.');
}
export class Files {
  constructor(service, dir, maxBytes = 5 * 1024 * 1024) { this.service = service; this.dir = dir; this.max = maxBytes; mkdirSync(dir, { recursive: true }); }
  upload(actor, pid, input) {
    const svc = this.service; svc.access(actor, pid, true);
    const audience = svc.validateAudience(actor, pid, input.audience);
    if (typeof input.base64 !== 'string' || !/^[a-zA-Z0-9+/]*={0,2}$/.test(input.base64)) throw new AppError('Invalid file encoding.');
    const bytes = Buffer.from(input.base64, 'base64');
    if (!bytes.length || bytes.length > this.max) throw new AppError(`File must be smaller than ${this.max / 1024 / 1024} MB.`, 413);
    const format = detectType(bytes), id = randomUUID();
    const name = text(input.name, 'File name', 150).replace(/[^\p{L}\p{N} ._-]/gu, '_');
    const path = join(this.dir, id);
    writeFileSync(path, bytes, { flag: 'wx', mode: 0o600 });
    try {
      return svc.s.tx(() => {
        const row = { id, project: pid, audience, name, type: format.type, size: bytes.length, path, uploader: actor.id, at: svc.now() };
        svc.s.put('attachments', row); svc.audit(actor, pid, 'attachment.uploaded', { attachment: id, audience });
        const { path: _, uploader: __, ...publicRow } = row; return publicRow;
      });
    } catch (error) { unlinkSync(path); throw error; }
  }
  download(actor, id) {
    const svc = this.service, row = svc.s.get('attachments', id);
    if (!row) throw new AppError('File not found.', 404);
    svc.access(actor, row.project);
    if (!svc.audienceAllowed(actor, row.project, row.audience)) throw new AppError('File not found.', 404);
    return { row, bytes: readFileSync(row.path) };
  }
}
