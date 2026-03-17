import * as fs from 'fs';
import * as path from 'path';
//  Checks which asset ids are referenced in the snapshot file and writes them to assets-being-used.json

function writeUsedAssetIds({
  assetsPath,
  snapshotPath,
  outputPath,
}: {
  assetsPath: string;
  snapshotPath: string;
  outputPath: string;
}) {
  const resolvedAssetsPath = path.resolve(assetsPath);
  const resolvedSnapshotPath = path.resolve(snapshotPath);
  const resolvedOutputPath = path.resolve(outputPath);
  const assets = JSON.parse(fs.readFileSync(resolvedAssetsPath, 'utf8'));
  const snapshotDocs = JSON.parse(
    fs.readFileSync(resolvedSnapshotPath, 'utf8')
  );
  // Recursively collect all string values from snapshot
  function collectStrings(obj: unknown, set: Set<string>) {
    if (typeof obj === 'string') {
      set.add(obj);
    } else if (Array.isArray(obj)) {
      for (const item of obj) collectStrings(item, set);
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) collectStrings(obj[key], set);
    }
  }
  const snapshotStrings = new Set<string>();
  for (const doc of snapshotDocs) {
    // Remove top-level id from doc before collecting strings
    const { id, ...rest } = doc;
    collectStrings(rest, snapshotStrings);
  }
  const usedAssetIds = assets
    .filter(asset => snapshotStrings.has(asset.id))
    .map(asset => asset.id);
  fs.writeFileSync(resolvedOutputPath, JSON.stringify(usedAssetIds, null, 2));
  const total = assets.length;
  const used = usedAssetIds.length;
  const percent = ((used / total) * 100).toFixed(2);
  console.log(`Wrote ${used} used asset ids to ${resolvedOutputPath}`);
  console.log(`Used assets: ${used}/${total} (${percent}%)`);
}

writeUsedAssetIds({
  assetsPath: '',
  snapshotPath: '',
  outputPath: '',
});
