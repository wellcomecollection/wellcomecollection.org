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

// We currently fetch 2 manifests v2 and v3.
// Once we've moved everything over to use iiif3, we can stop fetching version 2
// and just return Manifest | undefined
export async function fetchIIIFPresentationManifest(location: string): Promise<{
  v2: IIIFManifest | undefined;
  v3: Manifest | undefined;
}> {
  // TODO once we're using iiif3 everywhere,
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
