# BiteBud hosted live demo

The sensor sends to the local Mac as before. A separate bridge copies the latest
60 seconds and session summary to a dedicated private Vercel Blob store. A
read-only Vercel function serves that snapshot to the public website. The public
website has no reset, calibration, or simulated-data write endpoints.

Setup: connect a private Blob store to the BiteBud Vercel project. Enable its
read-write token environment variable. Save that token locally as
BLOB_READ_WRITE_TOKEN in .env.cloud. Never commit that file.

Run the local website/server with `npm run dev`. In another terminal run
`npm run demo:cloud`. Open https://bitebud.vercel.app/bitebud.
The bridge stops after two hours, or use Ctrl+C. The Mac must remain awake.
Cloud updates arrive every few seconds; a disconnected bridge is marked stale
within 15 seconds. The graph keeps the source timestamps and the mock label.

This shares the current tabletop demo readings with website visitors. Do not use
this public demo to transmit private participant or infant data. This is a demo
bridge, not a standalone cloud device connection. Blob operations count toward
your Vercel plan usage; run the bridge only during demonstrations.
