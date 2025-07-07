import { secrets } from '@weco/prismic-model/config';
import { setEnvsFromSecrets } from '@weco/ts-aws';

type CustomType = {
  id: string;
  label: string;
  repeatable: boolean;
  status: boolean;
  json: unknown;
  format: 'custom';
};

type SliceType = {
  id: string;
  name: string;
  variations: { imageUrl: string }[];
};

export type Credentials = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
};

async function getLocalType(id: string): Promise<CustomType | undefined> {
  try {
    return (await import(`@weco/common/customtypes/${id}`)).default;
  } catch (e) {
    console.warn(`Cannot load local type '${id}': ${e}`);
  }
}

async function getLocalSlice(name: string): Promise<SliceType | undefined> {
  try {
    return (await import(`@weco/common/views/slices/${name}/model.json`))
      .default;
  } catch (e) {
    console.warn(`Cannot load local slice '${name}': ${e}`);
  }
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

export async function getSharedSlices(
  credentials?: Credentials
): Promise<{ id: string; remote: SliceType; local?: SliceType }[]> {
  await setEnvsFromSecrets(secrets, credentials);

  const resp = await fetch(`https://customtypes.prismic.io/slices`, {
    headers: {
      Authorization: `Bearer ${process.env.PRISMIC_BEARER_TOKEN}`,
      repository: 'wellcomecollection',
    },
  });

  if (resp.status !== 200) {
    console.error(await resp.json());
    throw Error('Could not fetch slices');
  }

  const remoteSharedSlices: SliceType[] = await resp.json();

  return Promise.all(
    remoteSharedSlices.map(async remoteSharedSlice => {
      const { id, name } = remoteSharedSlice;
      const localSharedSlice = await getLocalSlice(name);
      return {
        id,
        remote: {
          ...remoteSharedSlice,
          variations: remoteSharedSlice.variations.map(variation => {
            return {
              ...variation,
              // The imageUrl is for the screenshot of the slice.
              // This is empty in the local version, but points to a prismic hosted image in the remote version
              // Since this doesn't effect the slice model, it's ok to remove for the purposes of comparison
              imageUrl: '',
            };
          }),
        },
        local: localSharedSlice,
      };
    })
  );
}
