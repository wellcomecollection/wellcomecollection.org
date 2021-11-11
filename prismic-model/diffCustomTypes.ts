import { CustomType } from './src/types/CustomType';
import * as dotenv from 'dotenv';
import * as jsondiffpatch from 'jsondiffpatch';
import fetch from 'node-fetch';
import { error, success } from './console';

dotenv.config();

async function run() {
  const remoteCustomTypes: CustomType[] = await fetch(
    `https://customtypes.prismic.io/customtypes`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PRISMIC_BEARER_TOKEN}`,
        repository: process.env.PRISMIC_REPOSITORY,
      },
    }
  ).then(resp => resp.json());

  const deltas = (
    await Promise.all(
      remoteCustomTypes.map(async remoteCustomType => {
        const localCustomType = (await import(`./src/${remoteCustomType.id}`))
          .default;

        const delta = jsondiffpatch.diff(remoteCustomType, localCustomType);

        if (delta) {
          return { id: remoteCustomType.id, delta };
        }
      })
    )
  ).filter(Boolean);

  if (deltas.length > 0) {
    error(`Diffs found on ${deltas.map(delta => delta.id).join(', ')}`);
    process.exit(1);
  }

  success('No diffs found on custom types');
}

run();
