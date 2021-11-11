import { setEnvsFromSecrets } from '@weco/ts-aws/secrets-manager';
import { getCreds } from '@weco/ts-aws/sts';
import * as jsondiffpatch from 'jsondiffpatch';
import fetch from 'node-fetch';
import { CustomType } from './src/types/CustomType';
import { error, success } from './console';
import { isCi, secrets } from './config';

export default async function diffContentTypes(credentials?): Promise<void> {
  await setEnvsFromSecrets(secrets, credentials);

  const resp = await fetch(`https://customtypes.prismic.io/customtypes`, {
    headers: {
      Authorization: `Bearer ${process.env.PRISMIC_BEARER_TOKEN}`,
      repository: 'wellcomecollection',
    },
  }).then();

  if (resp.status !== 200) {
    console.error(await resp.json());
    throw Error('Could not fetch custom types');
  }

  const remoteCustomTypes: CustomType[] = await resp.json();

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
  ).filter(Boolean) as { id: string; delta: jsondiffpatch.Delta }[];

  console.info(deltas);
  if (deltas.length > 0) {
    error(`Diffs found on ${deltas.map(delta => delta.id).join(', ')}`);
    process.exit(1);
  }

  success('No diffs found on custom types');
}

async function run() {
  const credentials = isCi
    ? undefined
    : await getCreds('experience', 'developer');

  await diffContentTypes(credentials);
}

run().catch(err => {
  error(err);
  process.exit(1);
});
