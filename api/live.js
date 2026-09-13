import { get } from '@vercel/blob';

// Public, read-only view of the tabletop demo. Credentials never reach the browser.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'This demo is read-only.' });
  }
  try {
    const blob = await get('bitebud/live.json', { access: 'private', useCache: false });
    if (!blob) return res.status(503).json({ error: 'Waiting for the prototype bridge on the demo Mac.' });
    const snapshot = await new Response(blob.stream).json();
    return res.status(200).json(snapshot);
  } catch {
    return res.status(503).json({ error: 'The live demo connection is unavailable. Start the prototype bridge on the demo Mac.' });
  }
}
