import { getDigitalLocationOfType } from '../../utils/works';
import {
  getAudio,
  getVideo,
  getDownloadOptionsFromManifest,
} from '../../utils/iiif';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { id } = req.query;
  const works = await fetch(
    `https://api.wellcomecollection.org/catalogue/v2/works?query=${id}&include=items`
  ).then(resp => resp.json());

  const work = works.results[0];

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
