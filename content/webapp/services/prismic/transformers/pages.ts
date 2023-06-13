import { FeaturedText } from '../../../types/text';
import { Page } from '../../../types/pages';
import { PagePrismicDocument } from '../types/pages';
import { links as headerLinks } from '@weco/common/views/components/Header/Header';
import {
  asText,
  transformFormat,
  transformGenericFields,
  transformSingleLevelGroup,
} from '.';
import { transformSeason } from './seasons';
import { dasherize } from '@weco/common/utils/grammar';
import flattenDeep from 'lodash.flattendeep';
import { Link } from '../../../types/link';
import { Body } from '../types/body';
import { SeasonPrismicDocument } from '../types/seasons';
import { transformContributors } from './contributors';
import { isNotUndefined, isUndefined } from '@weco/common/utils/type-guards';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import groupBy from 'lodash.groupBy';

type LinkWithLevel = Link & {
  level: number;
};

type LinkWithLevelIndexes = LinkWithLevel & {
  index: number;
  parentIndex: number;
};

export type LinkWithIndexChildren = Link & {
  index: number;
  children?: LinkWithIndexChildren;
};

function determineParentIndex({
  previousHeadingLevel,
  currentHeadingLevel,
  previousParentIndex,
  index,
  headings,
}: {
  previousHeadingLevel: number;
  currentHeadingLevel: number;
  previousParentIndex: number;
  index: number;
  headings: LinkWithLevelIndexes[];
}): number {
  if (currentHeadingLevel === previousHeadingLevel) {
    return previousParentIndex; // They share the same parent
  } else if (currentHeadingLevel > previousHeadingLevel) {
    return index - 1; // Then the previous item will be its parent
  } else {
    // The currentHeadingLevel is less than the previousHeadingLevel
    // so we find the most recent previous item with the same heading level and it will share its parent
    // If there isn't one, because of incorrect nesting, we give it the same parent as the current heading
    const previousSibling = [...headings]
      .reverse()
      .find(heading => heading.level === currentHeadingLevel);
    return previousSibling?.parentIndex || previousParentIndex;
  }
}

// We receive the headings from Prismic as a flat list
// but we want to display the links to them as a nested list
// so we need to construct a nested hierarchy.
// We don't always want to display the same depth of hierarchy
// so we can pass in a includeHeadingLevel parameter
export function constructHierarchy(
  headings: LinkWithLevel[],
  includeHeadingLevel: number
): LinkWithIndexChildren[] {
  const headingsWithParentIndex = headings.reduce(
    (acc, heading, index) => {
      const parentIndex = determineParentIndex({
        previousHeadingLevel: acc.previousHeadingLevel,
        currentHeadingLevel: heading.level,
        previousParentIndex: acc.parentIndex,
        index,
        headings: acc.headings,
      });
      // We don't include things at the top level if they aren't h2s
      // and we don't inlude headings that are lower than the specified depth
      if (
        !(parentIndex === -1 && heading.level !== 2) &&
        heading.level <= includeHeadingLevel
      ) {
        acc.headings.push({
          ...heading,
          index,
          parentIndex,
        });
      }
      return {
        ...acc,
        parentIndex,
        previousHeadingLevel: heading.level,
      };
    },
    {
      headings: [] as LinkWithLevelIndexes[],
      parentIndex: -1,
      previousHeadingLevel: 2,
    }
  ).headings;

  // Group by parent
  const groupedByParentIndex = groupBy(
    headingsWithParentIndex,
    heading => heading.parentIndex
  );

  // Then nest the groups under each appropriate parent
  // and return the top level, which contains all the other items nested below
  const levels = Object.keys(groupedByParentIndex).length;
  for (let level = 0; level < levels; level++) {
    for (const [key, value] of Object.entries<LinkWithLevelIndexes[]>(
      groupedByParentIndex
    )) {
      const itemsWithChildren = value.map(item => {
        const { parentIndex, level, ...restOfItem } = item; // We can get rid of some of the properties now
        const parts = groupedByParentIndex[item.index];
        if (parts) {
          return {
            ...restOfItem,
            children: groupedByParentIndex[item.index],
          };
        } else {
          return restOfItem;
        }
      });
      groupedByParentIndex[key] = itemsWithChildren;
    }
  }
  return groupedByParentIndex['-1'];
}

export function transformOnThisPage(
  body: Body,
  depth = 2
): LinkWithIndexChildren[] {
  const anchorLinks = flattenDeep(
    body.map(slice => slice.primary.title || slice.primary.text || [])
  )
    .filter(text => text.type.startsWith('heading'))
    .map(item => {
      const level = parseInt(item.type.slice(-1), 10);
      return {
        level,
        text: item.text,
        url: `#${dasherize(item.text)}`,
      };
    });
  return constructHierarchy(anchorLinks, depth);
}

export function transformPage(document: PagePrismicDocument): Page {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const seasons = transformSingleLevelGroup(data.seasons, 'season').map(
    season => transformSeason(season as SeasonPrismicDocument)
  );
  const parentPages = transformSingleLevelGroup(data.parents, 'parent').map(
    (parent, index) => {
      return {
        ...transformPage(parent as PagePrismicDocument),
        order: data.parents[index].order!,
        type: parent.type,
      };
    }
  );
  // TODO (tagging): This is just for now, we will be implementing a proper site tagging
  // strategy for this later
  const siteSections = headerLinks.map(link => link.siteSection);
  const siteSection = document.tags.find(tag => siteSections.includes(tag));

  const promoField = genericFields.promo;
  const promo = promoField?.image ? promoField : undefined;

  // There are two ways to supply the description for a page in Prismic:
  //
  //    - The metadata description field, under the "Metadata" tab
  //    - The promo text field on an editorial image, under the "Promo" tab
  //
  // These correspond to `page.metadataDescription` and `page.promo.caption`.
  //
  // If somebody puts the description on the image but there's no image, we'll discard
  // that description on the line above, and it won't get rendered on the page.
  //
  // There are quite a few pages (including all the press releases) where the promo text
  // is on the image, not the metadata description.  It's very non-obvious in the
  // Prismic UI that this is happening, so if the metadataDescription isn't
  // explicitly set, we copy it from the image promo instead.
  //
  // (We could also reconsider whether we really want to be discarding the promo
  // if there's no image, but that's low priority when we're resource constrained.
  // but until then, this warning will at least let us know when it's happening.)
  const metadataDescription = isNotUndefined(genericFields.metadataDescription)
    ? genericFields.metadataDescription
    : isUndefined(genericFields.metadataDescription) &&
      isUndefined(promo) &&
      isNotUndefined(promoField?.caption) &&
      promoField?.caption
    ? asText(promoField?.caption)
    : undefined;

  const contributors = transformContributors(document);

  return {
    type: 'pages',
    format: transformFormat(document),
    ...genericFields,
    metadataDescription,
    seasons,
    contributors,
    parentPages,
    onThisPage: data.body ? transformOnThisPage(data.body) : [],
    showOnThisPage: data.showOnThisPage || false,
    promo,
    datePublished: data.datePublished
      ? transformTimestamp(data.datePublished)
      : undefined,
    siteSection,
  };
}

export const getPageFeaturedText = (page: Page): FeaturedText | undefined => {
  const filteredFeaturedText = page.body.filter(
    slice => slice.weight === 'featured'
  );
  if (filteredFeaturedText.length) {
    return filteredFeaturedText[0] as FeaturedText;
  }
};
