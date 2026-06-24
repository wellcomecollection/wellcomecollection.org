/**
 * Generates a per-custom-type report of body slice usage, by comparing
 * the configured slice choices in the local JSON files against what is
 * actually present in a fresh Prismic snapshot.
 *
 * Run from the prismic-model directory:
 *   yarn unusedSlicesReport
 *
 * Pass --force to re-download the snapshot even if a local one exists.
 */

import fs from 'fs';
import path from 'path';

import {
  downloadPrismicSnapshot,
  getPrismicDocuments,
} from './downloadSnapshot';

// Paths to the custom type JSON files that have a body slice zone.
// Add more here if new custom types with body slices are introduced.
const CUSTOM_TYPE_FILES: Record<string, string> = {
  articles: '../../common/customtypes/articles/index.json',
  books: '../../common/customtypes/books/index.json',
  'event-series': '../../common/customtypes/event-series/index.json',
  events: '../../common/customtypes/events/index.json',
  exhibitions: '../../common/customtypes/exhibitions/index.json',
  guides: '../../common/customtypes/guides/index.json',
  pages: '../../common/customtypes/pages/index.json',
  places: '../../common/customtypes/places/index.json',
  projects: '../../common/customtypes/projects/index.json',
  seasons: '../../common/customtypes/seasons/index.json',
  series: '../../common/customtypes/series/index.json',
  'visual-stories': '../../common/customtypes/visual-stories/index.json',
  webcomics: '../../common/customtypes/webcomics/index.json',
};

type SliceZone = {
  type: 'Slices';
  config: { choices: Record<string, unknown> };
};

/** Reads the configured body slice choices from a custom type JSON file. */
function getConfiguredSlices(filePath: string): string[] {
  const raw = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8')
  );
  for (const tab of Object.values(raw.json) as Record<string, unknown>[]) {
    for (const [key, field] of Object.entries(tab)) {
      if (
        key === 'body' &&
        typeof field === 'object' &&
        field !== null &&
        (field as SliceZone).type === 'Slices'
      ) {
        return Object.keys((field as SliceZone).config.choices);
      }
    }
  }
  return [];
}

async function main() {
  const forceDownload = process.argv.includes('--force');

  // Get fresh snapshot — delete any existing ones if --force was passed.
  if (forceDownload) {
    for (const f of fs.readdirSync('.')) {
      if (f.startsWith('snapshot.') && f.endsWith('.json')) {
        fs.unlinkSync(f);
        console.log(`Deleted existing snapshot: ${f}`);
      }
    }
  }

  const snapshotFile = await downloadPrismicSnapshot();
  const documents = getPrismicDocuments(snapshotFile);
  const now = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });

  console.log(`\nSnapshot: prismic-model/${snapshotFile}`);
  console.log(`Generated: ${now}\n`);

  // Build a map: custom type id -> Map<slice type, count>
  const usageByType = new Map<string, Map<string, number>>();

  for (const doc of documents) {
    const slices: { slice_type: string }[] = doc.data?.body ?? [];
    if (!Array.isArray(slices) || slices.length === 0) continue;

    if (!usageByType.has(doc.type)) {
      usageByType.set(doc.type, new Map());
    }
    const counter = usageByType.get(doc.type)!;

    for (const slice of slices) {
      counter.set(slice.slice_type, (counter.get(slice.slice_type) ?? 0) + 1);
    }
  }

  // Count docs per type
  const docCountByType = new Map<string, number>();
  for (const doc of documents) {
    docCountByType.set(doc.type, (docCountByType.get(doc.type) ?? 0) + 1);
  }

  let anyRemovedButUsed = false;
  const results: string[] = [];

  for (const [typeId, filePath] of Object.entries(CUSTOM_TYPE_FILES)) {
    const configuredSlices = getConfiguredSlices(filePath);
    const usage = usageByType.get(typeId) ?? new Map<string, number>();
    const docCount = docCountByType.get(typeId) ?? 0;

    const usedSlices = configuredSlices.filter(s => usage.has(s));
    const unusedSlices = configuredSlices.filter(s => !usage.has(s));

    results.push(`### ${typeId}`);
    results.push(`- File: \`${filePath.replace('../../common/', 'common/')}\``);
    results.push(
      `- Docs: ${docCount} | Configured: ${configuredSlices.length} | Used: ${usedSlices.length} | Unused: ${unusedSlices.length}`
    );

    if (unusedSlices.length > 0) {
      results.push('\nUnused:');
      for (const s of unusedSlices.sort()) results.push(`- \`${s}\``);
    }

    if (usedSlices.length > 0) {
      results.push('\nUsed (by popularity):');
      const sorted = usedSlices
        .map(s => [s, usage.get(s) ?? 0] as [string, number])
        .sort((a, b) => b[1] - a[1]);
      for (const [s, count] of sorted) results.push(`- \`${s}\`: ${count}`);
    }

    results.push('');
  }

  // Check if any slices that were removed (present in main but not current files)
  // actually show usage in the snapshot.
  //
  // We do this by looking at slice types found in documents that are NOT in the
  // configured slice list for that type — these would be orphaned slice types.
  results.push('---');
  results.push(
    '## Slices present in documents but NOT in current custom type config'
  );
  results.push('');
  results.push(
    'These are slice types found in live content that are not configured in the'
  );
  results.push(
    'current (modified) JSON files. If any appear here, they were removed in error.\n'
  );

  let foundOrphans = false;
  for (const [typeId, filePath] of Object.entries(CUSTOM_TYPE_FILES)) {
    const configuredSlices = new Set(getConfiguredSlices(filePath));
    const usage = usageByType.get(typeId) ?? new Map<string, number>();

    const orphans = [...usage.entries()].filter(
      ([s]) => !configuredSlices.has(s)
    );
    if (orphans.length > 0) {
      foundOrphans = true;
      anyRemovedButUsed = true;
      results.push(
        `### ${typeId} — PROBLEM: slices in use but removed from config`
      );
      for (const [s, count] of orphans.sort()) {
        results.push(`- \`${s}\`: used ${count} times`);
      }
      results.push('');
    }
  }

  if (!foundOrphans) {
    results.push(
      'None. All configured slices in the current JSON files cover all live content.'
    );
  }

  const output = results.join('\n');
  console.log(output);

  const outFile = 'unusedSlicesReport.md';
  fs.writeFileSync(
    outFile,
    `# Unused Body Slices Report\n\nSnapshot: \`prismic-model/${snapshotFile}\`\n\nGenerated: ${now}\n\n## By custom type\n\n${results.join('\n')}`
  );
  console.log(`\nReport written to prismic-model/${outFile}`);

  if (anyRemovedButUsed) {
    console.error(
      '\n⚠️  WARNING: Some slices are in use but not configured — see above.'
    );
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
