import fs from 'fs';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const types = await fetch('https://customtypes.prismic.io/customtypes', {
    headers: {
      Authorization: `Bearer ${process.env.PRISMIC_BEARER_TOKEN}`,
      repository: process.env.PRISMIC_REPOSITORY,
    },
  }).then(resp => resp.json());

  types.forEach(type => {
    fs.writeFileSync(
      `./json/${type.id}.json`,
      JSON.stringify(type.json, null, 2)
    );
  });
}

main();

export {};
