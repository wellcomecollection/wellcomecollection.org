import { setEnvsFromSecrets } from '@weco/ts-aws/secrets-manager';
import { getCreds } from '@weco/ts-aws/sts';
import fetch from 'node-fetch';
import { CustomType } from './src/types/CustomType';
import { error, success } from './console';
import { isCi, secrets } from './config';
import { diffJson, isEmpty, printDelta } from './differ';

type Credentials = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
};

export default async function diffContentTypes(
  credentials?: Credentials
): Promise<void> {
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

        // We can get an error here if somebody adds a type in
        // the Prismic GUI, but doesn't define it locally.
        //
        // This erorr handling logic is meant to make this more
        // obvious, because otherwise you get an error like:
        //
        //      !!! Error: Cannot find module './src/testingtesting123'
        //
        try {
          const localCustomType = (await import(`./src/${remoteCustomType.id}`))
            .default;

          const delta = diffJson(remoteCustomType, localCustomType);

          if (!isEmpty(delta)) {
            console.log(`Diff on ${remoteCustomType.id}:`);
            printDelta(delta);
            return { id: remoteCustomType.id };
          }
        } catch (e) {
          console.warn(`Prismic has type ${remoteCustomType.id}, but it's not defined locally`);
          return { id: remoteCustomType.id };
        };
      })
    )
  ).filter(Boolean) as { id: string }[];

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

run();
