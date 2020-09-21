// @flow
import { type Work } from '../model/work';
import { type IIIFRendering } from '../model/iiif';
import { type LicenseAPIData } from '@weco/common/utils/licenses';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';

export function getProductionDates(work: Work) {
  return work.production
    .map(productionEvent => productionEvent.dates.map(date => date.label))
    .reduce((a, b) => a.concat(b), []);
}

type DownloadImage = {|
  url: string,
  width: ?number,
  height: ?number,
|};

export type ArchiveNode = {|
  id: string,
  title: string,
  alternativeTitles: string[],
  referenceNumber?: string,
  partOf?: [],
  parts?: [],
  precededBy?: [],
  succeededBy?: [],
  type: 'Work',
|};

export function getDownloadOptionsFromImageUrl(
  downloadImage: DownloadImage
): IIIFRendering[] {
  const smallImageWidth = 760;
  const imageDimensions = {
    fullWidth: downloadImage.width || null,
    fullHeight: downloadImage.height || null,
    smallWidth: smallImageWidth,
    smallHeight:
      downloadImage.width && downloadImage.height
        ? `${Math.round(
            downloadImage.height / (downloadImage.width / smallImageWidth)
          )}`
        : null,
  };
  if (downloadImage.url) {
    return [
      {
        '@id': convertImageUri(downloadImage.url, 'full'),
        format: 'image/jpeg',
        label: `This image (${
          imageDimensions.fullWidth && imageDimensions.fullHeight
            ? `${imageDimensions.fullWidth}x${imageDimensions.fullHeight} pixels`
            : 'Full size'
        })`,
      },
      {
        '@id': convertImageUri(downloadImage.url, 760),
        format: 'image/jpeg',
        label: `This image (${
          imageDimensions.smallHeight
            ? `${imageDimensions.smallWidth}x${imageDimensions.smallHeight} pixels`
            : '760px'
        })`,
      },
    ];
  } else {
    return [];
  }
}

export function getEncoreLink(sierraId: string): string {
  return `http://encore.wellcomelibrary.org/iii/encore/record/C__R${sierraId.substr(
    0,
    sierraId.length - 1
  )}`;
}

export function sierraIdFromPresentationManifestUrl(
  iiifPresentationLocation: string
): string {
  return (iiifPresentationLocation.match(/iiif\/(.*)\/manifest/) || [])[1];
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

type LocationType = {|
  id: string,
  label: string,
  type: 'LocationType',
|};

export type DigitalLocation = {|
  credit: string,
  license?: LicenseAPIData,
  locationType: LocationType,
  type: 'DigitalLocation',
  url: string,
|};
export type PhysicalLocation = {|
  locationType: LocationType,
  label: string,
  type: 'PhysicalLocation',
|};

export type WorkCatalogueItem = {|
  id: string,
  title?: string,
  identifiers: [],
  locations: (DigitalLocation | PhysicalLocation)[],
  type: string,
|};

type StacksItemStatus = {| id: string, label: string, type: 'ItemStatus' |};

// We have the items from the catalogue API and add additional data from the stacks API,
// data from UI interactions and data we work out based on location and status
export type PhysicalItemAugmented = {|
  ...WorkCatalogueItem,
  locations: PhysicalLocation[],
  dueDate?: string,
  status?: StacksItemStatus,
  checked: boolean,
  requestable: boolean,
  requested: boolean,
  requestSucceeded: boolean,
|};

export function getItemsWithPhysicalLocation(
  work: Work
): PhysicalItemAugmented[] {
  return (
    work.items &&
    work.items
      .map(item => {
        if (
          item.locations.find(location => location.type === 'PhysicalLocation')
        ) {
          return item;
        }
      })
      .filter(Boolean)
  );
}

export function getDigitalLocationOfType(
  work: Work,
  locationType: string
): ?DigitalLocation {
  const [item] =
    work.items &&
    work.items
      .map(item =>
        item.locations.find(
          location => location.locationType.id === locationType
        )
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

export function getAncestorArray(work: Work): ArchiveNode[] {
  // We're only interested in the item with a partOf property (which is the last item in the array), this can be removed once the API is updated to remove all ancestors from the top level array
  const desiredItem = work.partOf && work.partOf[work.partOf.length - 1];
  const ancestorArray = [];
  function addToAncestorArray(work) {
    ancestorArray.push({
      id: work.id,
      title: work.title,
      alternativeTitles: work.alternativeTitles,
      referenceNumber: work.referenceNumber,
      type: 'Work',
    });
    if (work.partOf) {
      // It's possible in the future that items will have multiple parents and we'll need a way to distinguish which one we're interested in, for now they only have one.
      const [ancestorWork] = work.partOf;
      if (ancestorWork) {
        addToAncestorArray(ancestorWork);
      }
    }
  }
  if (desiredItem) {
    addToAncestorArray(desiredItem);
  }
  return ancestorArray.reverse();
}
