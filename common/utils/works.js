// @flow
import { type Work } from '../model/work';
import {
  type IIIFManifest,
  type IIIFRendering,
  type IIIFMetadata,
  type IIIFCanvas,
} from '../model/iiif';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import getLicenseInfo, {
  type LicenseData,
} from '@weco/common/utils/get-license-info';

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

export function getVideo(iiifManifest: IIIFManifest) {
  const videoSequence =
    iiifManifest &&
    iiifManifest.mediaSequences &&
    iiifManifest.mediaSequences.find(sequence =>
      sequence.elements.find(
        element => element['@type'] === 'dctypes:MovingImage'
      )
    );
  return (
    videoSequence &&
    videoSequence.elements.find(
      element => element['@type'] === 'dctypes:MovingImage'
    )
  );
}

export function getAudio(iiifManifest: IIIFManifest) {
  const videoSequence =
    iiifManifest &&
    iiifManifest.mediaSequences &&
    iiifManifest.mediaSequences.find(sequence =>
      sequence.elements.find(element => element['@type'] === 'dctypes:Sound')
    );
  return (
    videoSequence &&
    videoSequence.elements.find(element => element['@type'] === 'dctypes:Sound')
  );
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

export function getItemsLicenseInfo(work: Work): LicenseData[] {
  const licenseData = work.items
    .map(item => {
      return (
        item.locations &&
        item.locations
          .map(location => {
            if (location.license) {
              return getLicenseInfo(location.license.id);
            } else {
              return null;
            }
          })
          .filter(Boolean)
      );
    })
    .reduce((a, b) => a.concat(b), []);
  return licenseData || [];
}

type LocationType = {|
  id: string,
  label: string,
  type: 'LocationType',
|};

export type DigitalLocation = {|
  credit: string,
  license: {|
    id: string,
    label: string,
    url: string,
    type: 'License',
  |},
  locationType: LocationType,
  type: 'DigitalLocation',
  url: string,
|};
export type PhysicalLocation = {|
  locationType: LocationType,
  label: string,
  type: 'PhysicalLocation',
|};

export function getDigitalLocationOfType( // TODO could there be more than one, so should this return an array
  work: Work,
  locationType: string
): ?DigitalLocation {
  const [item] = work.items
    .map(item =>
      item.locations.find(location => location.locationType.id === locationType)
    )
    .filter(Boolean);
  return item;
}

type Item = Object;

function itemIdentifierWithId(item: Item, id: string): boolean {
  const matchedIdentifiers = item.identifiers.filter(
    identifier => identifier.identifierType.id === id
  );

  return matchedIdentifiers.length >= 1;
}

function itemLocationWithType(item: Item, locationType: string): boolean {
  const matchedIdentifiers = item.locations.filter(
    location => location.type === locationType
  );

  return matchedIdentifiers.length >= 1;
}

type ItemProps = {|
  identifierId: string,
  locationType: string,
|};

export function getItemsWith(
  work: Work,
  { identifierId, locationType }: ItemProps
): Item[] {
  return work.items
    .filter(item => itemIdentifierWithId(item, identifierId))
    .filter(item => itemLocationWithType(item, locationType));
}

type WorkProps = {|
  identifierId: string,
|};

export function getWorkIdentifiersWith(
  work: Work,
  { identifierId }: WorkProps
) {
  return work.identifiers.reduce((acc, identifier) => {
    return identifier.identifierType.id === identifierId
      ? acc.concat(identifier.value)
      : acc;
  }, []);
}

export function getItemIdentifiersWith(
  work: Work,
  { identifierId, locationType }: ItemProps,
  identifierType: string
) {
  const items: Item[] = getItemsWith(work, { identifierId, locationType });

  return items.reduce((acc: string[], item: Item) => {
    const matching = item.identifiers.find(
      identifier => identifier.identifierType.id === identifierType
    );

    const matchingValue = matching && matching.value;

    if (matchingValue) {
      acc.push(matchingValue);
    }

    return acc;
  }, []);
}
