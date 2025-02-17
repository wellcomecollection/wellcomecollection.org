import { createClient } from '@prismicio/client';
import fetch from 'node-fetch';
import fs from 'node:fs';
import yargs from 'yargs';

import 'dotenv/config';

const { type } = yargs(process.argv.slice(2))
  .usage('Usage: $0 --type [customTypeId]')
  .options({
    type: { type: 'string', demandOption: true },
  })
  .parseSync();

async function init() {
  const repository = process.env.PRISMIC_REPO;
  const apiKey = process.env.PRISMIC_API_KEY;
  const email = process.env.PRISMIC_EMAIL;
  const password = process.env.PRISMIC_PASSWORD;

  if (!repository) {
    console.error('no repository key found');
    process.exit(1);
  }
  if (!apiKey) {
    console.error('no api key found');
    process.exit(1);
  }

  // fetch documents
  const client = createClient(repository, {
    fetch,
    // ref: process.env.PRISMIC_REF, // required to migrate _draft_ content
    // accessToken: process.env.PRISMIC_ACCESS_TOKEN, // also required for _draft_ content
  });

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const allDocs = await client.getAllByType(type as any);
  /* eslint-enable @typescript-eslint/no-explicit-any */

  fs.writeFile('migration.log', '', err => {
    if (err) {
      console.error(err);
    }
  });

  async function migrateDoc(doc, token) {
    if (!repository) {
      console.error('no repository key found');
      process.exit(1);
    }
    if (!apiKey) {
      console.error('no api key found');
      process.exit(1);
    }

    const body = doc.data.body.map(slice => {
      // mutate slice
      return slice;
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
