import { put } from '@vercel/blob';
import { setTimeout as delay } from 'node:timers/promises';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Missing BLOB_READ_WRITE_TOKEN. Save the demo store token in .env.cloud first.');
  process.exit(1);
}
const local = 'http://localhost:8787';
const endsAt = Date.now() + 30 * 60 * 1000;
let stopping = false;
let uploaded = false;
let failures = 0;
process.on('SIGINT', () => { stopping = true; });
process.on('SIGTERM', () => { stopping = true; });
console.log('Sharing the tabletop prototype session with the BiteBud website. Stops after 30 minutes or Ctrl+C.');
while (!stopping && Date.now() < endsAt) {
  try {
    const [response, healthResponse] = await Promise.all([
      fetch(`${local}/api/readings`, { signal: AbortSignal.timeout(5000) }),
      fetch(`${local}/api/health`, { signal: AbortSignal.timeout(5000) }),
    ]);
    if (!response.ok || !healthResponse.ok) throw new Error('Local server unavailable');
    const snapshot = await response.json();
    const health = await healthResponse.json();
    if (!Array.isArray(snapshot.readings) || !snapshot.summary) throw new Error('Invalid sensor response');
    await put('bitebud/live.json', JSON.stringify({
      readings: snapshot.readings,
      summary: snapshot.summary,
      mockRunning: Boolean(health.mockRunning),
      publishedAt: Date.now(),
    }), {
      access: 'private', allowOverwrite: true, addRandomSuffix: false,
      contentType: 'application/json', cacheControlMaxAge: 60,
      abortSignal: AbortSignal.timeout(10000),
    });
    if (!uploaded || failures) console.log('Connected: prototype readings are reaching cloud storage.');
    uploaded = true;
    failures = 0;
  } catch {
    failures += 1;
    if (failures === 1 || failures % 10 === 0) console.error('Connection interrupted. Check the local server and cloud credentials; retrying.');
  }
  await delay(failures ? Math.min(30000, failures * 2000) : 2000);
}
console.log('Cloud demo sharing stopped. The website will mark the last reading as disconnected.');
