import {
  DigitalLocation,
  Item,
  PhysicalLocation,
  RelatedWork,
  Work,
  Holding,
  PhysicalItem,
} from '../model/catalogue';
import { IIIFRendering } from '../model/iiif';
import { convertImageUri } from '../utils/convert-image-uri';
import { Label } from '../model/labels';
import getAugmentedLicenseInfo, { LicenseData } from '../utils/licenses';

export function getProductionDates(work: Work): string[] {
  return work.production
    .map(productionEvent => productionEvent.dates.map(date => date.label))
    .reduce((a, b) => a.concat(b), []);
}

type DownloadImage = {
  url: string;
  width?: number;
  height?: number;
};

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
        width: 'full',
      },
      {
        '@id': convertImageUri(downloadImage.url, smallImageWidth),
        format: 'image/jpeg',
        label: `This image (${
          imageDimensions.smallHeight
            ? `${imageDimensions.smallWidth}x${imageDimensions.smallHeight} pixels`
            : `${smallImageWidth}px`
        })`,
        width: smallImageWidth,
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
  'archives and manuscripts': 'archive',
  ephemera: 'threeD',
  evideos: 'video',
  websites: 'website',
};
export function getWorkTypeIcon(work: Work): string | undefined {
  return workTypeIcons[work.workType.label.toLowerCase()];
}

type StacksItemStatus = {
  id: string;
  label: string;
  type: 'ItemStatus';
};

// We have the items from the catalogue API and add additional data from the stacks API,
// data from UI interactions and data we work out based on location and status
export type PhysicalItemAugmented = {
  locations: PhysicalLocation[];
  dueDate?: string;
  status?: StacksItemStatus;
  checked?: boolean;
  requestable?: boolean;
  requested?: boolean;
  requestSucceeded?: boolean;
};

export function getHoldings(work: Work): Holding[] {
  return work?.holdings || [];
}

export function getItemsWithPhysicalLocation(work: Work): PhysicalItem[] {
  return (work.items ?? [])
    .map(item => {
      if (
        item.locations.find(location => location.type === 'PhysicalLocation')
      ) {
        return item as PhysicalItem;
      }
    })
    .filter((item?: PhysicalItem): item is PhysicalItem => Boolean(item));
}

export function getItemsByLocationType(
  work: Work,
  locationTypeId: string
): Item[] {
  return (work.items || []).filter(i =>
    i?.locations.find(l => l.locationType.id === locationTypeId)
  );
}

export function getDigitalLocationOfType(
  work: Work,
  locationType: string
): DigitalLocation | undefined {
  const [location] = (work.items ?? [])
    .map(item =>
      item.locations.find(location => location.locationType.id === locationType)
    )
    .filter(
      (
        location?: DigitalLocation | PhysicalLocation
      ): location is DigitalLocation => location?.type === 'DigitalLocation'
    );
  return location;
}

export function getAccessConditionForDigitalLocation(
  digitalLocation?: DigitalLocation
): string | undefined {
  if (digitalLocation) {
    const accessConditions = digitalLocation?.accessConditions || [];
    const accessCondition = accessConditions.find(
      condition => condition.status
    );
    return accessCondition?.status?.id;
  }
}

function itemIdentifierWithId(item: Item, id: string): boolean {
  const matchedIdentifiers =
    item.identifiers?.filter(
      identifier => identifier && identifier.identifierType.id === id
    ) ?? [];

  return matchedIdentifiers.length >= 1;
}

function itemLocationWithType(item: Item, locationType: string): boolean {
  const matchedIdentifiers = item.locations.filter(
    location => location.type === locationType
  );

  return matchedIdentifiers.length >= 1;
}

type ItemProps = {
  identifierId: string;
  locationType: string;
};

export function getItemsWith(
  work: Work,
  { identifierId, locationType }: ItemProps
): Item[] {
  return (
    work.items
      ?.filter(item => itemIdentifierWithId(item, identifierId))
      .filter(item => itemLocationWithType(item, locationType)) ?? []
  );
}

type WorkProps = {
  identifierId: string;
};

export function getWorkIdentifiersWith(
  work: Work,
  { identifierId }: WorkProps
): string[] {
  return work.identifiers.reduce((acc: string[], identifier) => {
    return identifier.identifierType.id === identifierId
      ? acc.concat(identifier.value)
      : acc;
  }, []);
}

export function getItemIdentifiersWith(
  work: Work,
  { identifierId, locationType }: ItemProps,
  identifierType: string
): string[] {
  const items: Item[] = getItemsWith(work, { identifierId, locationType });

  return items.reduce((acc: string[], item: Item) => {
    const matching = item.identifiers?.find(
      identifier => identifier.identifierType.id === identifierType
    );

    const matchingValue = matching?.value;

    if (matchingValue) {
      acc.push(matchingValue);
    }

    return acc;
  }, []);
}

type ArchiveLabels = {
  reference: string;
  partOf?: string;
};

export const isAvailableOnline = (work: Work): boolean =>
  work.availabilities.some(({ id }) => id === 'online');

const getArchiveRoot = (work: RelatedWork): RelatedWork =>
  work?.partOf?.[0] ? getArchiveRoot(work.partOf[0]) : work;

export const getArchiveLabels = (work: Work): ArchiveLabels | undefined => {
  if (work.referenceNumber) {
    const root = getArchiveRoot(work);
    return {
      reference: work.referenceNumber,
      partOf: root.id !== work.id ? root.title : undefined,
    };
  }
  return undefined;
};

export const getCardLabels = (work: Work): Label[] => {
  const cardLabels = [{ text: work.workType.label }];
  if (isAvailableOnline(work)) {
    return [...cardLabels, { text: 'Online', labelColor: 'white' }];
  } else {
    return cardLabels;
  }
};

function makeArchiveAncestorArray(partOfArray, nextPart) {
  if (!nextPart) return partOfArray;
  return makeArchiveAncestorArray(
    [...partOfArray, nextPart],
    nextPart?.partOf?.[0]
  );
}

export function getArchiveAncestorArray(work: Work): RelatedWork[] {
  return makeArchiveAncestorArray([], work?.partOf?.[0]).reverse();
}

type DigitalLocationInfo = {
  accessCondition: string | undefined;
  license: LicenseData | undefined;
};

export function getDigitalLocationInfo(
  digitalLocation: DigitalLocation
): DigitalLocationInfo {
  return {
    accessCondition: getAccessConditionForDigitalLocation(digitalLocation),
    license:
      digitalLocation?.license &&
      getAugmentedLicenseInfo(digitalLocation.license),
  };
}

export function getLocationLabel(
  location: PhysicalLocation | DigitalLocation
): string | undefined {
  if ((location as PhysicalLocation).label) {
    return (location as PhysicalLocation).label;
  }
}

export function getLocationShelfmark(
  location: PhysicalLocation | DigitalLocation
): string | undefined {
  if ((location as PhysicalLocation).shelfmark) {
    return (location as PhysicalLocation).shelfmark;
  }
}

export function getLocationLink(
  location: PhysicalLocation | DigitalLocation
): { url: string; linkText: string } | undefined {
  if ((location as DigitalLocation).url) {
    return {
      url: (location as DigitalLocation).url,
      linkText:
        (location as DigitalLocation)?.linkText ||
        (location as DigitalLocation).url,
    };
  }
}
