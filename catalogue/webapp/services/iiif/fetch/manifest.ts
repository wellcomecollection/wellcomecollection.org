import { getIIIFManifest } from '../../../utils/iiif/v2';
import { Manifest } from '@iiif/presentation-3';
import { IIIFManifest } from '../types/manifest/v2';

export type IIIFManifests = {
  manifestV2: IIIFManifest | undefined;
  manifestV3: Manifest | undefined;
};

export async function fetchIIIFPresentationManifest(
  location: string
): Promise<Manifest | undefined> {
  // TODO once we're using v3 everywhere,
  // we'll want the catalogue API to return v3, then we can stop doing the following
  const v3Location = location.replace('/v2/', '/v3/');
  const iiifManifest = await getIIIFManifest(v3Location);

  return iiifManifest;
}
