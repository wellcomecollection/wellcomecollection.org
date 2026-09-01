import {
  AccessCondition,
  DigitalLocation,
  Location,
  Location as LocationType,
  PhysicalLocation,
} from '@weco/common/model/catalogue';
import { Label } from '@weco/common/model/labels';
import { LinkProps } from '@weco/common/model/link-props';
import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import {
  getCatalogueLicenseData,
  LicenseData,
} from '@weco/common/utils/licenses';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import {
  Holding,
  Item,
  Note,
  PhysicalItem,
  RelatedWork,
  Work,
  Work as WorkType,
} from '@weco/content/services/wellcome/catalogue/types';
import { DownloadOption } from '@weco/content/types/manifest';
import { toConceptLink } from '@weco/content/views/components/ConceptLink';
import { toSearchWorksLink } from '@weco/content/views/components/SearchPagesLink/Works';
import { TagType } from '@weco/content/views/components/Tags';

/**
 * Returns the label of every production date on a work, flattened into one
 * array.
 */
export function getProductionDates(work: Work): string[] {
  return work.production
    .map(productionEvent => productionEvent.dates.map(date => date.label))
    .reduce((a, b) => a.concat(b), []);
}

/**
 * Returns work's language id, but only if it has exactly one - better no
 * language than a wrong guess.
 */
export function getLanguageId(
  work: Pick<Work, 'languages'>
): string | undefined {
  return work.languages && work.languages.length === 1
    ? work.languages[0].id
    : undefined;
}

type DownloadImage = {
  url: string;
  width?: number;
  height?: number;
};

/**
 * Builds download options for an image url: full size, plus a smaller
 * preset width.
 */
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

/**
 * Items from the catalogue API augmented with data from the stacks API, UI
 * interactions, and values derived from location/status.
 */
export type PhysicalItemAugmented = {
  locations: PhysicalLocation[];
  dueDate?: string;
  status?: StacksItemStatus;
  checked?: boolean;
  requestable?: boolean;
  requested?: boolean;
  requestSucceeded?: boolean;
};

/** Returns work's holdings, or an empty array if it has none. */
export function getHoldings(work: Work): Holding[] {
  return work.holdings || [];
}

/** Filters items down to those with a physical location. */
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

/** Returns work's items that have a location of the given locationTypeId. */
export function getItemsByLocationType(
  work: Work,
  locationTypeId: string
): Item<PhysicalLocation | DigitalLocation>[] {
  return (work.items || []).filter(i =>
    i.locations.find(l => l.locationType.id === locationTypeId)
  );
}

/**
 * Returns work's first digital location matching the given locationType, if
 * any.
 */
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

/**
 * Returns the status id of the first access condition on digitalLocation
 * that has one.
 */
export function getAccessConditionForDigitalLocation(
  digitalLocation: DigitalLocation
): string | undefined {
  const accessCondition = digitalLocation.accessConditions.find(
    condition => condition.status
  );
  return accessCondition?.status?.id;
}

export type ArchiveLabels = {
  reference: string;
  partOf?: string;
};

/** Whether work is available online. */
export const isAvailableOnline = (work: Work): boolean =>
  (work.availabilities ?? []).some(({ id }) => id === 'online');

/**
 * Returns all ancestors of a work, ordered from the most distant, keeping
 * only partOf items with totalParts (i.e. part of the strict hierarchy).
 */
export function getArchiveAncestorArray(work: Work): RelatedWork[] {
  return [...(work.partOf || []).filter(item => item.totalParts)].reverse();
}

/**
 * Builds the archive reference/partOf labels for a work, if it has a
 * reference number.
 */
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

/**
 * If the thing being linked to is identified, links to its concept page,
 * otherwise links to a pre-filtered search.
 */
export const conceptOrSearchLink = ({
  id,
  filterKey,
  filterValue,
}: {
  id?: string;
  filterKey: 'subjects.label' | 'contributors.agent.label';
  filterValue: string;
}): LinkProps =>
  id
    ? toConceptLink({ conceptId: id })
    : toSearchWorksLink({ [filterKey]: [filterValue] });

/**
 * Builds display tags for a work's subjects, linking each to its concept
 * page or a pre-filtered search.
 */
export const getSubjectTags = (work: Work): TagType[] =>
  work.subjects.map(s => ({
    textParts: s.id
      ? [s.concepts[0].label].concat(s.concepts.slice(1).map(c => c.label))
      : s.concepts.map(c => c.label),
    linkAttributes: conceptOrSearchLink({
      id: s.id,
      filterKey: 'subjects.label',
      filterValue: s.label,
    }),
  }));

/**
 * Builds the label chips shown on a work's search result card (its work
 * type, plus "Online" if available online).
 */
export const getCardLabels = (work: Work): Label[] => {
  const cardLabels = work.workType ? [{ text: work.workType.label }] : [];

  if (isAvailableOnline(work)) {
    return [...cardLabels, { text: 'Online', labelColor: 'white' }];
  } else {
    return cardLabels;
  }
};

/**
 * Puts notes relevant to archives in a consistent order, separating out
 * anything else so it can still be displayed.
 */
export const getOrderedNotes = (
  work: Pick<Work, 'notes'>,
  excludeNotes: (Note | undefined)[] = []
): { orderedNotes: Note[]; remainingNotes: Note[] } => {
  const arrangementNote = work.notes.filter(
    note => note.noteType.id === 'arrangement-note'
  );
  const biographicalNote = work.notes.filter(
    note => note.noteType.id === 'biographical-note'
  );
  const relatedMaterial = work.notes.filter(
    note => note.noteType.id === 'related-material'
  );
  const acquisitionNote = work.notes.filter(
    note => note.noteType.id === 'acquisition-note'
  );

  const orderedNotes = [
    ...arrangementNote,
    ...acquisitionNote,
    ...biographicalNote,
    ...relatedMaterial,
  ];

  const excluded = [...orderedNotes, ...excludeNotes];
  const remainingNotes = work.notes.filter(
    note => !excluded.some(n => n === note)
  );

  return { orderedNotes, remainingNotes };
};

/** Whether label is a real, displayable value,
 * i.e. not missing or the API's '-' placeholder for "no label". */
export function hasRealLabel(label?: string): label is string {
  return Boolean(label) && label !== '-';
}

/**
 * Returns label unless it's missing or the API's '-' placeholder for "no
 * label", in which case falls back to titleOverride (defaults to 'unknown title').
 */
export function getFileLabel(
  label?: string,
  titleOverride: string = 'unknown title'
): string {
  return hasRealLabel(label) ? label : titleOverride;
}

export type DigitalLocationInfo = {
  accessCondition: string | undefined;
  license: LicenseData | undefined;
};

/** Builds the access condition and license info for a digital location. */
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

/**
 * Returns location's label, if it has one (only PhysicalLocation carries
 * this field).
 */
export function getLocationLabel(
  location: PhysicalLocation | DigitalLocation
): string | undefined {
  if ((location as PhysicalLocation).label) {
    return (location as PhysicalLocation).label;
  }
}

/**
 * Returns location's shelfmark, if it has one (only PhysicalLocation carries
 * this field).
 */
export function getLocationShelfmark(
  location: PhysicalLocation | DigitalLocation
): string | undefined {
  if ((location as PhysicalLocation).shelfmark) {
    return (location as PhysicalLocation).shelfmark;
  }
}

/**
 * Returns a url/linkText pair for location, if it has a url (only
 * DigitalLocation carries this field).
 */
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

/** Returns the first PhysicalLocation on item, if any. */
export function getFirstPhysicalLocation(
  item: PhysicalItem
): PhysicalLocation | undefined {
  return item.locations?.find(location => location.type === 'PhysicalLocation');
}

/** Returns the first access condition on location, if any. */
export function getFirstAccessCondition(
  location?: Location
): AccessCondition | undefined {
  return location?.accessConditions?.[0];
}

/**
 * Whether to show the "view item" link, based on access condition and
 * staff-restricted-access override.
 */
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

/**
 * Builds the links shown in the internal API debug toolbar for a work
 * (JSON, IIIF manifest, identifiers, Library Data Link Explorer).
 */
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
