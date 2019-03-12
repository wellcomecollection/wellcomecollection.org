// @flow
import { type Work } from '../model/work';
import { type IIIFManifest, type IIIFRendering } from '../model/iiif';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';

export function getPhysicalLocations(work: Work) {
  return work.items
    .map(item =>
      item.locations.filter(location => location.type === 'PhysicalLocation')
    )
    .reduce((acc, locations) => acc.concat(locations), []);
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
  const sequence = iiifManifest.sequences.find(
    sequence => sequence['@type'] === 'sc:Sequence'
  );
  return (sequence && sequence.rendering) || [];
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
