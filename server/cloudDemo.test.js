import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/live.js';

function response() {
  return {
    headers: {}, code: 200,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('public cloud demo rejects write requests and disables caching', async () => {
  for (const method of ['POST', 'PUT', 'DELETE', 'PATCH']) {
    const res = response();
    await handler({ method }, res);
    assert.equal(res.code, 405);
    assert.equal(res.headers.Allow, 'GET');
    assert.equal(res.headers['Cache-Control'], 'no-store');
  }
});
