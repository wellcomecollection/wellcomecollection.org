import {
  AccessCondition,
  DigitalLocation,
  Location,
  Location as LocationType,
  PhysicalLocation,
} from '@weco/common/model/catalogue';
import { Label } from '@weco/common/model/labels';
import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import {
  getCatalogueLicenseData,
  LicenseData,
} from '@weco/common/utils/licenses';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import {
  Holding,
  Item,
  PhysicalItem,
  RelatedWork,
  Work,
  Work as WorkType,
} from '@weco/content/services/wellcome/catalogue/types';
import { DownloadOption } from '@weco/content/types/manifest';

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
): DownloadOption[] {
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
        id: convertIiifImageUri(downloadImage.url, 'full'),
        format: 'image/jpeg',
        label: `This image (${
          imageDimensions.fullWidth && imageDimensions.fullHeight
            ? `${imageDimensions.fullWidth}x${imageDimensions.fullHeight} pixels`
            : 'Full size'
        })`,
        width: 'full',
      },
      {
        id: convertIiifImageUri(downloadImage.url, smallImageWidth),
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
  return work.holdings || [];
}

export function getItemsWithPhysicalLocation(
  items: Item<Location>[]
): PhysicalItem[] {
  return items
    .map(item => {
      if (
        item.locations.some(location => location.type === 'PhysicalLocation')
      ) {
        return item as PhysicalItem;
      }
      return undefined;
    })
    .filter((item?: PhysicalItem): item is PhysicalItem => Boolean(item));
}

export function getItemsByLocationType(
  work: Work,
  locationTypeId: string
): Item<PhysicalLocation | DigitalLocation>[] {
  return (work.items || []).filter(i =>
    i.locations.find(l => l.locationType.id === locationTypeId)
  );
}

export function getDigitalLocationOfType(
  work: Pick<Work, 'items'>,
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
  digitalLocation: DigitalLocation
): string | undefined {
  const accessCondition = digitalLocation.accessConditions.find(
    condition => condition.status
  );
  return accessCondition?.status?.id;
}

function itemIdentifierWithId(
  item: Item<PhysicalLocation | DigitalLocation>,
  id: string
): boolean {
  return (item.identifiers || []).some(
    identifier => identifier.identifierType.id === id
  );
}

function itemLocationWithType(
  item: Item<PhysicalLocation | DigitalLocation>,
  locationType: string
): boolean {
  return item.locations.some(location => location.type === locationType);
}

type ItemProps = {
  identifierId: string;
  locationType: string;
};

export function getItemsWith(
  work: Work,
  { identifierId, locationType }: ItemProps
): Item<PhysicalLocation | DigitalLocation>[] {
  return (
    work.items
      ?.filter(item => itemIdentifierWithId(item, identifierId))
      .filter(item => itemLocationWithType(item, locationType)) ?? []
  );
}

export function getItemIdentifiersWith(
  work: Work,
  { identifierId, locationType }: ItemProps,
  identifierType: string
): string[] {
  const items: Item<PhysicalLocation | DigitalLocation>[] = getItemsWith(work, {
    identifierId,
    locationType,
  });

  return items.reduce(
    (acc: string[], item: Item<PhysicalLocation | DigitalLocation>) => {
      const matching = item.identifiers?.find(
        identifier => identifier.identifierType.id === identifierType
      );

      const matchingValue = matching?.value;

      if (matchingValue) {
        acc.push(matchingValue);
      }

      return acc;
    },
    []
  );
}

export type ArchiveLabels = {
  reference: string;
  partOf?: string;
};

export const isAvailableOnline = (work: Work): boolean =>
  (work.availabilities ?? []).some(({ id }) => id === 'online');

export const getArchiveLabels = (work: Work): ArchiveLabels | undefined => {
  if (work.referenceNumber) {
    const root = getArchiveAncestorArray(work)[0] || work;
    return {
      reference: work.referenceNumber,
      partOf: root.id !== work.id ? root.title : undefined,
    };
  }
  return undefined;
};

export const getCardLabels = (work: Work): Label[] => {
  const cardLabels = work.workType ? [{ text: work.workType.label }] : [];

  if (isAvailableOnline(work)) {
    return [...cardLabels, { text: 'Online', labelColor: 'white' }];
  } else {
    return cardLabels;
  }
};

// Return all the ancestors of work starting with the most distant.
// Filters partOf items to only include those with totalParts (part of the strict hierarchy)

export function getArchiveAncestorArray(work: Work): RelatedWork[] {
  return [...(work.partOf || []).filter(item => item.totalParts)].reverse();
}

export function getFileLabel(
  label?: string,
  titleOverride?: string
): string | undefined {
  return (label !== '-' && label) || titleOverride;
}

export type DigitalLocationInfo = {
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
      getCatalogueLicenseData(digitalLocation.license),
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

export function getFirstPhysicalLocation(
  item: PhysicalItem
): PhysicalLocation | undefined {
  return item.locations?.find(location => location.type === 'PhysicalLocation');
}

export function getFirstAccessCondition(
  location?: Location
): AccessCondition | undefined {
  return location?.accessConditions?.[0];
}

export function showItemLink({
  userIsStaffWithRestricted,
  hasIIIFManifest,
  digitalLocation,
  accessCondition,
}: {
  userIsStaffWithRestricted: boolean;
  hasIIIFManifest: boolean;
  digitalLocation?: DigitalLocation;
  accessCondition?: string;
}): boolean {
  if (
    accessCondition === 'closed' ||
    (accessCondition === 'restricted' && !userIsStaffWithRestricted)
  ) {
    return false;
  } else if (hasIIIFManifest && digitalLocation) {
    return true;
  } else {
    return false;
  }
}

export function createApiToolbarWorkLinks(
  work: WorkType,
  apiUrl: string
): ApiToolbarLink[] {
  const apiLink = {
    id: 'json',
    label: 'JSON',
    link: apiUrl,
  };

  const iiifItem = work.items
    ?.reduce((acc, item) => {
      return acc.concat(item.locations);
    }, [] as LocationType[])
    ?.find(location => location.locationType.id.startsWith('iiif'));

  const iiifLink = iiifItem &&
    iiifItem.type === 'DigitalLocation' && {
      id: 'iiif',
      label: 'IIIF',
      link: iiifItem.url.replace('/v2/', '/v3/'),
    };

  const links = [
    apiLink,
    iiifLink,
    ...work.identifiers.map(id => ({
      id: id.value,
      label: id.identifierType.label,
      value: id.value,
    })),
    {
      id: 'library-data-link-explorer',
      label: 'Library Data Link Explorer',
      ariaLabel: 'open matcher graph via the Library Data Link Explorer',
      link: `https://main.d33vyuqnhij7au.amplifyapp.com/?workId=${work.id}`,
    },
  ].filter(Boolean) as ApiToolbarLink[];

  return links;
}
