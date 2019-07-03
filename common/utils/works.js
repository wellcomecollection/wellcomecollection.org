// @flow
import { type Work } from '../model/work';
import {
  type IIIFManifest,
  type IIIFRendering,
  type IIIFMetadata,
  type IIIFCanvas,
} from '../model/iiif';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';

export function getPhysicalLocations(work: Work) {
  return work.items
    .map(item =>
      item.locations.filter(location => location.type === 'PhysicalLocation')
    )
    .reduce((acc, locations) => acc.concat(locations), []);
}

export function getIIIFMetadata(
  iiifManifest: IIIFManifest,
  label: string
): ?IIIFMetadata {
  const repository = iiifManifest.metadata.find(data => data.label === label);
  return repository;
}

export function getDigitalLocations(work: Work) {
  return work.items
    .map(item =>
      item.locations.filter(location => location.type === 'DigitalLocation')
    )
    .reduce((acc, locations) => acc.concat(locations), []);
}

export function getProductionDates(work: Work) {
  return work.production
    .map(productionEvent => productionEvent.dates.map(date => date.label))
    .reduce((a, b) => a.concat(b), []);
}

export function getDownloadOptionsFromManifest(
  iiifManifest: IIIFManifest
): IIIFRendering[] {
  const sequence =
    iiifManifest.sequences &&
    iiifManifest.sequences.find(
      sequence => sequence['@type'] === 'sc:Sequence'
    );
  const sequenceRendering = sequence && sequence.rendering;
  const sequenceRenderingArray = Array.isArray(sequenceRendering)
    ? sequenceRendering
    : [sequenceRendering];

  const pdfRenderingArray = iiifManifest.mediaSequences
    ? iiifManifest.mediaSequences.reduce((acc, sequence) => {
        return acc.concat(
          sequence.elements
            .map(element => {
              return {
                '@id': element['@id'],
                format: element.format,
                label: `Download ${
                  element.format === 'application/pdf' ? 'PDF' : 'file'
                }`,
              };
            })
            .filter(Boolean)
        );
      }, [])
    : [];
  return [...sequenceRenderingArray, ...pdfRenderingArray].filter(Boolean);
}

export function getDownloadOptionsFromImageUrl(
  imageUrl: string
): IIIFRendering[] {
  return [
    {
      '@id': convertImageUri(imageUrl, 'full'),
      format: 'image/jpeg',
      label: 'Download full size',
    },
    {
      '@id': convertImageUri(imageUrl, 760),
      format: 'image/jpeg',
      label: 'Download small (760px)',
    },
  ];
}

export function getCanvases(iiifManifest: IIIFManifest): IIIFCanvas[] {
  const sequence =
    iiifManifest.sequences &&
    iiifManifest.sequences.find(
      sequence =>
        sequence['@type'] === 'sc:Sequence' &&
        sequence.compatibilityHint !== 'displayIfContentUnsupported'
    );
  return sequence ? sequence.canvases : [];
}

function getManifests(iiifManifest: IIIFManifest): IIIFManifest[] {
  return iiifManifest.manifests || null;
}

export function getManifestViewType(iiifManifest: IIIFManifest) {
  const manifests = getManifests(iiifManifest);
  const video =
    iiifManifest.mediaSequences &&
    iiifManifest.mediaSequences.find(sequence =>
      sequence.elements.find(
        element => element['@type'] === 'dctypes:MovingImage'
      )
    );
  const audio =
    iiifManifest.mediaSequences &&
    iiifManifest.mediaSequences.find(sequence =>
      sequence.elements.find(element => element['@type'] === 'dctypes:Sound')
    );
  const canvases = getCanvases(iiifManifest);
  const downloadOptions = getDownloadOptionsFromManifest(iiifManifest);
  const pdfRendering =
    downloadOptions.find(option => option.label === 'Download PDF') || false;
  return manifests
    ? 'multi'
    : audio
    ? 'audio'
    : video
    ? 'video'
    : canvases.length > 0
    ? 'iiif'
    : pdfRendering
    ? 'pdf'
    : 'none';
}

export type IIIFPresentationLocation = {|
  locationType: {
    id: 'iiif-presentation',
    label: 'IIIF Presentation API',
    type: 'LocationType',
  },
  url: string,
  type: 'DigitalLocation',
|};

export function getIIIFPresentationLocation(
  work: Work
): IIIFPresentationLocation {
  return work.items
    .map(item =>
      item.locations.find(
        location => location.locationType.id === 'iiif-presentation'
      )
    )
    .filter(Boolean)[0];
}

export function getEncoreLink(sierraId: string): string {
  return `http://search.wellcomelibrary.org/iii/encore/record/C__R${sierraId.substr(
    0,
    sierraId.length - 1
  )}`;
}

const workTypeIcons = {
  '3dobjects': 'threeD',
  ebooks: 'book',
  books: 'book',
  audio: 'audio',
  'digital images': 'digitalImage',
  journals: 'journal',
  maps: 'map',
  music: 'music',
  sound: 'music',
  pictures: 'picture',
  archivesandmanuscripts: 'scroll',
  ephemera: 'threeD',
  evideos: 'video',
  websites: 'website',
};
export function getWorkTypeIcon(work: Work): ?string {
  return workTypeIcons[work.workType.label.toLowerCase()];
}

export function getLocationType(work: Work, locationType: string) {
  const [item] = work.items
    .map(item =>
      item.locations.find(location => location.locationType.id === 'iiif-image')
    )
    .filter(Boolean);

  return item;
}
