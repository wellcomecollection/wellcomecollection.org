import { Manifest } from '@iiif/presentation-3';
import { Toggles } from '@weco/toggles';

async function getIIIFManifest(url: string): Promise<Manifest> {
  const resp = await fetch(url);

  if (resp.status === 404) {
    const bnumber = url.match(/b[0-9]{7}[0-9x]/)?.[0];
    const dashboardUrl = bnumber
      ? `https://iiif.wellcomecollection.org/dash/Manifestation/${bnumber}`
      : '';

    throw new Error(
      `Tried to retrieve IIIF Manifest at ${url}, but it's 404-ing. To fix, try running the "Rebuild IIIF" task in the iiif-builder dashboard. ${dashboardUrl}`
    );
  }

  const manifest = await resp.json();
  return manifest;
}

export async function fetchIIIFPresentationManifest(
  location: string,
  toggles: Toggles
): Promise<Manifest | undefined> {
  // TODO once we're using v3 everywhere,
  // we'll want the catalogue API to return v3, then we can stop doing the following
  const v3Location = toggles.useIIIFTest
    ? location
        .replace('/v2/', '/v3/')
        .replace(
          'iiif.wellcomecollection.org',
          'iiif-test.wellcomecollection.org'
        )
    : location.replace('/v2/', '/v3/');

  const iiifManifest = await getIIIFManifest(v3Location);

  return iiifManifest;
}
