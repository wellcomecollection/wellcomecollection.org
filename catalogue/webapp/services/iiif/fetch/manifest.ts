import { Manifest } from '@iiif/presentation-3';
import { fetchJson } from '@weco/common/utils/http';

async function getIIIFManifest(url: string): Promise<Manifest> {
  const manifest = await fetchJson(url);
  return manifest;
}

export async function fetchIIIFPresentationManifest(
  location: string
): Promise<Manifest | undefined> {
  // TODO once we're using v3 everywhere,
  // we'll want the catalogue API to return v3, then we can stop doing the following
  const v3Location = location.replace('/v2/', '/v3/');
  const iiifManifest = await getIIIFManifest(v3Location);

  return iiifManifest;
}
