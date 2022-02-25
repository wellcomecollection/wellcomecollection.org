import { FeaturedText } from '@weco/common/model/text';
import { Page } from '../../../types/pages';
import { PagePrismicDocument } from '../types/pages';
import { links as headerLinks } from '@weco/common/views/components/Header/Header';
import { transformFormat, transformGenericFields, transformSingleLevelGroup, transformTimestamp } from '.';
import { transformSeason } from './seasons';
import { dasherize } from '@weco/common/utils/grammar';
import flattenDeep from 'lodash.flattendeep';
import { Link } from '@weco/common/model/link';
import { Body } from '../types/body';
import { SeasonPrismicDocument } from '../types/seasons';
import { transformContributors } from './contributors';

export function transformOnThisPage(body: Body): Link[] {
  return flattenDeep(
    body.map(slice => slice.primary['title'] || slice.primary['text'] || [])
  )
    .filter(text => text.type === 'heading2')
    .map(item => {
      return {
        text: item.text,
        url: `#${dasherize(item.text)}`,
      };
    });
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

  const promo = genericFields.promo;

  const contributors = transformContributors(document);

  return {
    type: 'pages',
    format: transformFormat(document),
    ...genericFields,
    seasons,
    contributors,
    parentPages,
    onThisPage: data.body ? transformOnThisPage(data.body) : [],
    showOnThisPage: data.showOnThisPage || false,
    promo: promo && promo.image ? promo : undefined,
    datePublished: data.datePublished ? transformTimestamp(data.datePublished) : undefined,
    siteSection: siteSection,
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
