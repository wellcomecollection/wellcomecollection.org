import { Manifest } from '@iiif/presentation-3';

async function getIIIFManifest(
  url: string,
  workTypeId?: string
): Promise<Manifest | undefined> {
  try {
    const resp = await fetch(url);

    if (resp.status === 404) {
      const bnumber = url.match(/b[0-9]{7}[0-9x]/)?.[0];

      // We have to add this condition because of a known issue with BD works and Archivematica
      // We don't want the error to be sent if it's part of the known issue.
      // https://github.com/wellcomecollection/wellcomecollection.org/issues/10907
      // TODO: Check in once in a while to see if it's been fixed. There is not ticket to link to currently for that piece of work.

      // This workType ID identifies Born Digital works ("Archives - Digital")
      // https://github.com/wellcomecollection/catalogue-pipeline/issues/2659
      if (workTypeId !== 'hdig') {
        const dashboardUrl = `https://iiif.wellcomecollection.org/dash/Manifestation/${bnumber}`;

        console.error(
          `Tried to retrieve IIIF Manifest at ${url}, but it's 404-ing. To fix, try running the "Rebuild IIIF" task in the iiif-builder dashboard. ${dashboardUrl}`
        );
      }

      return undefined;
    }

    const manifest = await resp.json();
    return manifest;
  } catch (e) {
    console.error(
      `Something went wrong fetching ${url}` +
        `${e.message ? `: ${e.message}` : ''}`
    );
    throw e;
  }
}

export async function fetchIIIFPresentationManifest({
  location,
  workTypeId,
}: {
  location: string;
  workTypeId?: string;
}): Promise<Manifest | undefined> {
  // TODO once we're using v3 everywhere,
  // we'll want the catalogue API to return v3, then we can stop doing the following
  const v3Location = location.replace('/v2/', '/v3/');

  const iiifManifest = await getIIIFManifest(v3Location, workTypeId);

  return iiifManifest;
}
