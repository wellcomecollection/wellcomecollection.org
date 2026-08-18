// Regenerates the catalogue API types from the OpenAPI spec in
// wellcomecollection/catalogue-api. Run with `yarn generate:catalogue-types`.
import { console } from 'node:console';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';

import openapiTS, { astToString } from 'openapi-typescript';

// CATALOGUE_SPEC_REF pins the fetch to an exact commit; the dispatch workflow
// sets it because raw.githubusercontent.com can serve a cached main for a few
// minutes after a push. Local runs and the cron fallback use main.
const specRef = process.env.CATALOGUE_SPEC_REF || 'main';
const specUrl = `https://raw.githubusercontent.com/wellcomecollection/catalogue-api/${specRef}/reference/catalogue.yaml`;

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(
  root,
  'content/webapp/services/wellcome/catalogue/types/generated/catalogue-api.d.ts'
);

const header = `/**
 * This file is generated from wellcomecollection/catalogue-api's OpenAPI spec
 * (reference/catalogue.yaml) by \`yarn generate:catalogue-types\`.
 * Do not edit it by hand.
 */
`;

const ast = await openapiTS(new URL(specUrl));
await mkdir(dirname(output), { recursive: true });
await writeFile(output, header + '\n' + astToString(ast));
console.log(`Wrote ${output}`);
