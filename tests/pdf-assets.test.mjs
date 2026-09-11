import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  downloadsDir,
  manifestPath,
  pdfAssets,
  readSourceSnapshot,
  sha256,
} from "../pdf-assets.mjs";

test("downloaded PDF assets match current sources and manifest hashes", async () => {
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const snapshot = await readSourceSnapshot();

  assert.equal(manifest.version, 1);
  assert.equal(manifest.sourceSha256, snapshot.sourceSha256, 'PDF downloads are stale. Run node export-pdf.mjs and commit the updated downloads.');
  assert.deepEqual(manifest.sources, snapshot.sources);

  for (const asset of pdfAssets) {
    const entry = manifest.pdfs?.[asset.lang];
    assert.ok(entry, `manifest missing ${asset.lang} PDF entry`);
    assert.equal(entry.file, asset.file);

    const bytes = await fs.readFile(path.join(downloadsDir, asset.file));
    assert.ok(bytes.length > 1024, `${asset.file} is unexpectedly small`);
    assert.equal(bytes.subarray(0, 5).toString("ascii"), "%PDF-");
    assert.equal(entry.bytes, bytes.length);
    assert.equal(entry.sha256, sha256(bytes));
  }
});
