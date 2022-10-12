import { getIIIFManifest } from '../../../utils/iiif/v2';
import { Manifest } from '@iiif/presentation-3';
import { IIIFManifest } from '../types/manifest/v2';

async function fetchManifest(
  location: string
): Promise<IIIFManifest | Manifest | undefined> {
  try {
    const iiifManifestPromise = getIIIFManifest(location);
    const iiifManifest = await iiifManifestPromise;
    return iiifManifest;
  } catch {}
}

// We currently fetch 2 versions of the iiif manifest for an item (v2 and v3).
// We started with v2 only, but began using v3 for audio items (see https://github.com/wellcomecollection/wellcomecollection.org/pull/7637)
// in order to display a transcript where there are multiple audio parts.
// Something that we couldn't do with v2.
// We now want to move everything over to use v3 in preparation for born digital items,
// which will only be available as a v3 manifest,
// and also because v2 manifests will stop being available for audio/visual items.
// When v2 of the manifest is no longer required by transformManifest()
// we should stop fetching v2 and just return Manifest | undefined from this function
export async function fetchIIIFPresentationManifest(location: string): Promise<{
  v2: IIIFManifest | undefined;
  v3: Manifest | undefined;
}> {
  // TODO once we're using v3 everywhere,
  // we'll want the catalogue API to return v3, then we can stop doing the following
  const v3Location = location.replace('/v2/', '/v3/');

  const iiifManifestV2Promise = fetchManifest(location);
  const iiifManifestV3Promise = fetchManifest(v3Location);

  const [iiifManifestV2, iiifManifestV3] = await Promise.all([
    iiifManifestV2Promise,
    iiifManifestV3Promise,
  ]);

  return {
    v2: iiifManifestV2 as IIIFManifest | undefined,
    v3: iiifManifestV3 as Manifest | undefined,
  };
}
