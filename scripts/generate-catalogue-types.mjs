// Regenerates the catalogue API types from the OpenAPI spec in
// wellcomecollection/catalogue-api. Run with `yarn generate:catalogue-types`.
import { console } from 'node:console';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import openapiTS, { astToString } from 'openapi-typescript';

const specUrl =
  'https://raw.githubusercontent.com/wellcomecollection/catalogue-api/main/reference/catalogue.yaml';

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
