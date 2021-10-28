import fs from 'fs';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config();

type PrismicType = {
  id: string;
  label: string;
  repeatable: boolean;
  json: unknown;
  status: boolean;
};

async function main() {
  const types: PrismicType[] = await fetch(
    'https://customtypes.prismic.io/customtypes',
    {
      headers: {
        Authorization: `Bearer ${process.env.PRISMIC_BEARER_TOKEN}`,
        repository: process.env.PRISMIC_REPOSITORY,
      },
    }
  ).then(resp => resp.json());

  types
    .filter(type => type.status)
    .forEach(type => {
      fs.writeFileSync(
        `./json/${type.id}.json`,
        JSON.stringify(type.json, null, 2)
      );
    });
}

main();

export {};
