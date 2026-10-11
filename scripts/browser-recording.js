// Record the actual browser viewport locally using Chromium screenshots and MediaRecorder.
import { appendFileSync, writeFileSync } from 'node:fs';
export async function startRecording(command, evaluate, path) {
  const details = await evaluate(`(() => {
    const canvas = document.createElement('canvas'); canvas.width = innerWidth; canvas.height = innerHeight;
    canvas.style.display = 'none'; document.body.append(canvas);
    const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t));
    if (!mime) throw Error('WebM recording is unavailable.');
    const recorder = new MediaRecorder(canvas.captureStream(2), { mimeType: mime, videoBitsPerSecond: 1500000 });
    window.__wipRecording = { canvas, recorder, chunks: [], stopped: false };
    recorder.ondataavailable = e => { if(e.data.size) window.__wipRecording.chunks.push(e.data); };
    recorder.onstop = () => { window.__wipRecording.stopped = true; };
    recorder.start(10000); return { width: canvas.width, height: canvas.height, mime };
  })()`);
  writeFileSync(path, Buffer.alloc(0));
  const started = Date.now(); let running = true, frames = 0, failure;
  const drain = async () => {
    const data = await evaluate(`(async () => {
      const chunks = window.__wipRecording.chunks.splice(0); if (!chunks.length) return '';
      const bytes = new Uint8Array(await new Blob(chunks).arrayBuffer()); let binary = '';
      for (let i=0;i<bytes.length;i+=8192) binary += String.fromCharCode(...bytes.subarray(i,i+8192));
      return btoa(binary);
    })()`);
    if (data) appendFileSync(path, Buffer.from(data, 'base64'));
  };
  const loop = (async () => {
    try {
      while (running) {
        const image = await command('Page.captureScreenshot', { format: 'jpeg', quality: 65 });
        await evaluate(`(async () => { const img = new Image(); img.src = 'data:image/jpeg;base64,${image.data}'; await img.decode(); const c=window.__wipRecording.canvas; c.getContext('2d').drawImage(img,0,0,c.width,c.height); })()`);
        frames++; if (frames % 20 === 0) await drain();
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (e) { failure = e; }
  })();
  return { async stop() {
    running = false; await loop;
    await evaluate('window.__wipRecording.recorder.stop()');
    for(let i=0;i<50;i++) { if(await evaluate('window.__wipRecording.stopped')) break; await new Promise(r=>setTimeout(r,100)); }
    await drain(); if(failure) throw failure;
    return { ...details, frames, durationSeconds: Math.round((Date.now()-started)/1000), path };
  } };
}
