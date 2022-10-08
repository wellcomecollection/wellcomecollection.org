import { getIIIFManifest } from '../../../utils/iiif';
import { Manifest } from '@iiif/presentation-3';
import { IIIFManifest } from '../../../model/iiif';

// We currently fetch 2 manifests v2 and v3.
// Once we've moved everything over to use iiif3, we can stop fetching version 2
export async function fetchIIIFPresentationManifest(location: string): Promise<
  | {
      v2: IIIFManifest;
      v3: Manifest;
    }
  | undefined
> {
  try {
    const iiifManifestPromise = getIIIFManifest(location);
    const iiifManifestV3Promise = getIIIFManifest(
      location.replace('/v2/', '/v3/') // TODO once we're using iiif3 everywhere, we'll want the catalogue API to return v3, then we can stop doing this
    );
    const [iiifManifest, iiifManifestV3] = await Promise.all([
      iiifManifestPromise,
      iiifManifestV3Promise,
    ]);

    return {
      v2: iiifManifest as IIIFManifest,
      v3: iiifManifestV3 as Manifest,
    };
  } catch {}
}
