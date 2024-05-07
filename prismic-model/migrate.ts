import { createClient } from '@prismicio/client';
import yargs from 'yargs';
import fetch from 'node-fetch';
import fs from 'node:fs';
import 'dotenv/config';

const { id } = yargs(process.argv.slice(2))
  .usage('Usage: $0 --id [customTypeId]')
  .options({
    id: { type: 'string', demandOption: true },
  })
  .parseSync();

async function init() {
  const repository = process.env.PRISMIC_REPO;
  const apiKey = process.env.PRISMIC_API_KEY;
  const email = process.env.PRISMIC_EMAIL;
  const password = process.env.PRISMIC_PASSWORD;

  // fetch documents
  const client = createClient(repository, { fetch });
  const allDocs = await client.getAllByType(id);

  fs.writeFile('migration.log', '', err => {
    if (err) {
      console.error(err);
    }
  });
  async function migrateDoc(doc, token) {
    const body = doc.data.body
      .filter(slice => {
        return !(
          slice.slice_type === 'editorialImage' &&
          slice.slice_label === 'featured'
        ); // remove featured images (we don't display them currently, and if we remove the label, they will start showing up, which we don't want)
      })
      .map(slice => {
        // handle image gallery frames with new boolean field
        if (
          slice.slice_type === 'editorialImageGallery' &&
          slice.slice_label === 'frames'
        ) {
          slice.primary.isFrames = true;
        }

        // get rid of 'quoteV2'
        if (slice.slice_type === 'quoteV2') {
          const idSuffix = slice.id.match(/\$.*/);
          slice.slice_type = 'quote';
          slice.id = `quote${idSuffix}`;
        }

        // handle pull/review quotes with new boolean field
        if (
          (slice.slice_type === 'quote' || slice.slice_type === 'quotev2') &&
          (slice.slice_label === 'pull' || slice.slice_label === 'review')
        ) {
          slice.primary.isPullOrReview = true;
        }

        // remove all labels
        slice.slice_label = null;

        return {
          variation: 'default', // all slices require a variation to appear in the editor
          ...slice,
        };
      });

    doc.data.body = body;

    // construct the request URL
    const url = `https://migration.prismic.io/documents/${doc.id}`;

    // Send the update
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        repository,
      },
      method: 'PUT',
      body: JSON.stringify(doc),
    });

    try {
      const res = await response.json();
      console.log(res);

      if (!res.id) {
        // probably rate limited – make sure we log the id so we can manually migrate later
        fs.appendFile('migration.log', `${doc.id}\n\n`, err => {
          if (err) {
            console.error(err);
          }
        });
      }
    } catch (error) {
      const { message } = error;
      fs.appendFile('migration.log', `${message}\n\n`, err => {
        if (err) {
          console.error(err);
        }
      });

      console.error(message);
    }
  }

  // get an auth token
  const authResponse = await fetch('https://auth.prismic.io/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const token = await authResponse.text();
  const timer = ms => new Promise(resolve => setTimeout(resolve, ms));

  for (const doc of allDocs) {
    await timer(2000); // don't make too many requests
    migrateDoc(doc, token);
  }
}

init();
