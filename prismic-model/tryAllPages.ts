import { error } from './console';
import { downloadPrismicSnapshot } from './downloadSnapshot';
import fs from 'fs';
import fetch from 'node-fetch';

type PrismicDocument = {
  id: string;
  type: string;
};

function getPrismicDocuments(snapshotDir: string): PrismicDocument[] {
  const documents: PrismicDocument[] = [];

  fs.readdirSync(snapshotDir).forEach(file => {
    const data = fs.readFileSync(`${snapshotDir}/${file}`);
    const json: { results: PrismicDocument[] } = JSON.parse(data.toString());

    documents.push(...json.results);
  });

  return documents;
}

const nonVisibleTypes = new Set([
  'people',
  'organisations',
  'featured-books',
  'editorial-contributor-roles',
  'places',
  'card',
  'teams',
  'event-formats',
  'audiences',
  'article-formats',
  'project-formats',
  'event-policies',
  'interpretation-types',
  'exhibition-formats',
  'labels',
  'background-textures',
  'popup-dialog',
  'guide-formats',
  'page-formats',
  'collection-venue',
  'global-alert',
]);

async function checkDocument({ id, type }: PrismicDocument) {
  if (nonVisibleTypes.has(type)) {
    return;
  }

  let url: string;

  switch (type) {
    case 'webcomics':
      url = `http://localhost:3000/articles/${id}`;
      break;

    case 'webcomic-series':
      url = `http://localhost:3000/series/${id}`;
      break;

    default:
      url = `http://localhost:3000/${type}/${id}`;
      break;
  }

  const resp = await fetch(url);
  if (resp.status !== 200) {
    error(`${resp.status} ${url}`);
  }
}

async function run() {
  const snapshotDir = await downloadPrismicSnapshot();

  for (const doc of getPrismicDocuments(snapshotDir)) {
    await checkDocument(doc);
  }
}

run().catch(err => {
  error(err);
  process.exit(1);
});
