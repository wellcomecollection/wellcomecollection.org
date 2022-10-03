import { setEnvsFromSecrets } from '@weco/ts-aws/secrets-manager';
import { CustomType } from '../src/types/CustomType';
import { secrets } from '../config';
import fetch from 'node-fetch';

export type Credentials = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
};

export async function getContentTypes(
  credentials?: Credentials
): Promise<{ id: string; remote: CustomType; local?: CustomType }[]> {
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

  return Promise.all(
    remoteCustomTypes.map(async remoteCustomType => {
      const { id } = remoteCustomType;
      // We can get an error here if somebody adds a type in
      // the Prismic GUI, but doesn't define it locally.
      //
      // This error handling logic is meant to make this more
      // obvious, because otherwise you get an error like:
      //
      //      !!! Error: Cannot find module './src/testingtesting123'
      //
      try {
        const localCustomType = (await import(`./src/${id}`)).default;

        return { id, remote: remoteCustomType, local: localCustomType };
      } catch (e) {
        console.warn(
          `Prismic has type ${id}, but it can't be loaded locally: ${e}`
        );
        return { id, remote: remoteCustomType };
      }
    })
  );
}
