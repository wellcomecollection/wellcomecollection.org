import { setEnvsFromSecrets } from '@weco/ts-aws';
import { secrets } from '../config';
import fetch from 'node-fetch';

type CustomType = {
  id: string;
  label: string;
  repeatable: boolean;
  status: boolean;
  json: unknown;
  format: 'custom';
};

export type Credentials = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
};

export async function getLocalType(
  id: string
): Promise<CustomType | undefined> {
  try {
    return (await import(`@weco/common/customtypes/${id}`)).default;
  } catch (e) {
    console.warn(`Cannot load local type '${id}': ${e}`);
  }
}

export async function getCustomType(
  credentials: Credentials,
  id: string
): Promise<CustomType | undefined> {
  await setEnvsFromSecrets(secrets, credentials);

  const resp = await fetch(`https://customtypes.prismic.io/customtypes/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.PRISMIC_BEARER_TOKEN}`,
      repository: 'wellcomecollection',
    },
  });

  if (resp.status === 404) {
    return undefined;
  }

  return resp.json();
}

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

      const localCustomType = await getLocalType(id);

      return { id, remote: remoteCustomType, local: localCustomType };
    })
  );
}
