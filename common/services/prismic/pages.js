// @flow
import {
  parseTimestamp,
  parseGenericFields,
  parseOnThisPage,
  parseSingleLevelGroup,
  parseFormat,
} from './parsers';
// $FlowFixMe (tsx)
import { parseSeason } from './seasons';
// $FlowFixMe (tsx)
import { links } from '../../views/components/Header/Header';
import type { Page } from '../../model/pages';
import type { PrismicDocument } from './types';

export function parsePage(document: PrismicDocument): Page {
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
  const siteSections = links.map(link => link.siteSection);
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
