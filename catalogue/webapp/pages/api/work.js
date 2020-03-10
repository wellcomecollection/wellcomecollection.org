// @flow
import fetch from 'isomorphic-unfetch';
import { getDigitalLocationOfType } from '@weco/common/utils/works';
import {
  getAudio,
  getVideo,
  getDownloadOptionsFromManifest,
} from '@weco/common/utils/iiif';

export default async (req: any, res: any) => {
  const bNumber = req.query;
  const works = await fetch(
    `https://api.wellcomecollection.org/catalogue/v2/works?query=${bNumber}`
  ).then(resp => resp.json());

  if (works.results.length > 0);
  const { id } = req.query;
  const work = await fetch(
    `https://api.wellcomecollection.org/catalogue/v2/works/${id}?include=items`
  ).then(resp => resp.json());

  const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');
  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );
  const manifest = iiifPresentationLocation
    ? await fetch(iiifPresentationLocation.url).then(resp => resp.json())
    : null;

  const video = manifest && getVideo(manifest);
  const audio = manifest && getAudio(manifest);

  const downloadOptions = manifest && getDownloadOptionsFromManifest(manifest);
  const pdfRendering =
    (downloadOptions &&
      downloadOptions.find(option => option.label === 'Download PDF')) ||
    null;
  const iiifImageLocationUrl = iiifImageLocation && iiifImageLocation.url;
  const canvases =
    manifest && manifest.sequences && manifest.sequences[0].canvases
      ? manifest.sequences[0].canvases
      : [];
  const currentCanvas = canvases[0] ? canvases[0] : null;
  const mainImageService =
    currentCanvas && currentCanvas.images[0].resource.service
      ? {
          '@id': currentCanvas.images[0].resource.service['@id'],
        }
      : null;

  const canRender = !!(
    audio ||
    video ||
    pdfRendering ||
    mainImageService ||
    iiifImageLocationUrl
  );

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify({ canRender }));
};
