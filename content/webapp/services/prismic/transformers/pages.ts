import { FeaturedText } from '@weco/common/model/text';
import { parsePage } from '@weco/common/services/prismic/pages';
import { Page } from '../../../types/pages';
import { PagePrismicDocument } from '../types/pages';
import {
  parseFormat,
  parseGenericFields,
  parseOnThisPage,
  parseSingleLevelGroup,
  parseTimestamp,
} from '@weco/common/services/prismic/parsers';
import { parseSeason } from '@weco/common/services/prismic/seasons';
import { links as headerLinks } from '@weco/common/views/components/Header/Header';

export function transformPage(document: PagePrismicDocument): Page {
  const { data } = document;
  const genericFields = parseGenericFields(document);
  const seasons = parseSingleLevelGroup(data.seasons, 'season').map(season => {
    return parseSeason(season);
  });
  const parentPages = parseSingleLevelGroup(data.parents, 'parent').map(
    (parent, index) => {
      return {
        ...parsePage(parent),
        order: data.parents[index].order,
        type: parent.type,
      };
    }
  );
  // TODO (tagging): This is just for now, we will be implementing a proper site tagging
  // strategy for this later
  const siteSections = headerLinks.map(link => link.siteSection);
  const siteSection = document.tags.find(tag => siteSections.includes(tag));

  const promo = genericFields.promo;
  return {
    type: 'pages',
    format: data.format && parseFormat(data.format),
    ...genericFields,
    seasons,
    parentPages,
    onThisPage: data.body ? parseOnThisPage(data.body) : [],
    showOnThisPage: data.showOnThisPage || false,
    promo: promo && promo.image ? promo : null,
    datePublished: data.datePublished && parseTimestamp(data.datePublished),
    siteSection: siteSection,
    prismicDocument: document,
  };
}

export const getPageFeaturedText = (page: Page): FeaturedText | undefined => {
  const filteredFeaturedText = page.body.filter(
    slice => slice.weight === 'featured'
  );
  if (filteredFeaturedText.length) {
    return filteredFeaturedText[0];
  }
};
