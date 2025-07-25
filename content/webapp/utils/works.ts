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
import {
  DownloadOption,
  ItemsStatus,
  TransformedCanvas,
} from '@weco/content/types/manifest';
import { hasItemType } from '@weco/content/utils/iiif/v3';

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
  const cardLabels = work.workType ? [{ text: work.workType.label }] : [];

  if (isAvailableOnline(work)) {
    return [...cardLabels, { text: 'Online', labelColor: 'white' }];
  } else {
    return cardLabels;
  }
};

function makeArchiveAncestorArray(
  partOfArray: RelatedWork[],
  nextPart: RelatedWork | undefined
) {
  /*
  Recursively populate a list of ancestors (i.e. things that this object is "part of")

  Objects outside of this strict single-parent hierarchy are ignored.

  The returned list is ordered from closest to furthest (parent, grandparent, great grandparent).
  */
  if (!nextPart) {
    return partOfArray;
  }
  return makeArchiveAncestorArray(
    [...partOfArray, nextPart],
    hierarchicalParentOf(nextPart)
  );
}

function hierarchicalParentOf(work: RelatedWork): RelatedWork | undefined {
  /*
  Return the immediate parent of a Work within a strict single parent hierarchy.

  The partOf member of a Work contains a tree of objects to which this Work belongs.

  In strictly hierarchical content (Archive Collection data), each Work will have
  maximally one partOf value. However, partOf is a list that may contain other
  parents or containers.

  The number of child objects that any given object in the partOf hierarchy has is
  stored in the totalParts property.

  Any object in the partOf list that has no parts is not part of the hierarchy.

  These should be excluded from the ancestor hierarchy as they
  may represent an excessively broad member lists or multi-parent hierarchies
  such as Library Series.
  */
  if (!work || !work.partOf) {
    return;
  }
  for (const candidate of work.partOf) {
    if (candidate.totalParts) {
      return candidate;
    }
  }
}

export function getArchiveAncestorArray(work: Work): RelatedWork[] {
  /*
  Return all the ancestors of work starting with the most distant.
  */
  return makeArchiveAncestorArray([], hierarchicalParentOf(work)).reverse();
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
  allOriginalPdfs,
  hasIIIFManifest,
  digitalLocation,
  accessCondition,
  canvases,
  itemsStatus,
}: {
  userIsStaffWithRestricted: boolean;
  allOriginalPdfs: boolean;
  hasIIIFManifest: boolean;
  digitalLocation?: DigitalLocation;
  accessCondition?: string;
  canvases?: TransformedCanvas[];
  itemsStatus?: ItemsStatus;
}): boolean {
  // In general we don't show the item link if there are born digital items present, i.e. canvases with a behavior of placeholder, because we display download links on the page instead.
  // The exception to this is if ALL the items are born digital and they are ALL pdfs, as we know we can show them on the items page.
  // We also don't show the item link if there are video or sound items present because we display the players on the page instead. The exception to this is if they are restricted items and the user has a role of 'StaffWithRestricted'.
  // In which case we show the link not the players.
  // This means we rely on there only being one type of thing in a manifest, otherwise non video/sound items will be hidden from the user.
  // This is usually the case, except for manifests with 'Born digital' items.
  // But since we display links to all files when there are 'Born digital' items present, then this should not matter.
  const hasVideo = hasItemType(canvases, 'Video');
  const hasSound =
    hasItemType(canvases, 'Sound') || hasItemType(canvases, 'Audio');
  if (accessCondition === 'restricted' && userIsStaffWithRestricted) {
    return true;
  }
  if (
    accessCondition === 'closed' ||
    (accessCondition === 'restricted' && !userIsStaffWithRestricted)
  ) {
    return false;
  } else if (
    hasIIIFManifest &&
    digitalLocation &&
    !hasVideo &&
    !hasSound &&
    (itemsStatus === 'allStandard' || allOriginalPdfs)
  ) {
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
