import flattenDeep from 'lodash.flattendeep';

import { SiteSection } from '@weco/common/model/site-section';
import {
  PagesDocument as RawPagesDocument,
  PagesDocumentData as RawPagesDocumentData,
  SeasonsDocument as RawSeasonsDocument,
} from '@weco/common/prismicio-types';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { dasherize } from '@weco/common/utils/grammar';
import { isNotUndefined, isUndefined } from '@weco/common/utils/type-guards';
import { links as headerLinks } from '@weco/common/views/components/Header';
import { Link } from '@weco/content/types/link';
import { Page } from '@weco/content/types/pages';

import {
  asText,
  transformFormat,
  transformGenericFields,
  transformSingleLevelGroup,
} from '.';
import { transformContributors } from './contributors';
import { transformSeason } from './seasons';

export function transformOnThisPage(
  body: RawPagesDocumentData['body']
): Link[] {
  return flattenDeep(
    body.map(slice => slice.primary.title || slice.primary.text || [])
  )
    .filter(text => text.type === 'heading2')
    .map(item => {
      return {
        text: item.text,
        url: `#${dasherize(item.text)}`,
      };
    });
}

export function transformPage(document: RawPagesDocument): Page {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const seasons = data?.seasons
    ? transformSingleLevelGroup(data.seasons, 'season').map(season =>
        transformSeason(season as RawSeasonsDocument)
      )
    : [];
  const parentPages = data?.parents
    ? transformSingleLevelGroup(data.parents, 'parent').map((parent, index) => {
        return {
          ...transformPage(parent as RawPagesDocument),
          order: data.parents[index].order!,
          type: parent.type,
          tags: parent.tags,
          siteSection: parent.siteSection,
        };
      })
    : [];

  const introText = data?.introText;
  const siteSections = headerLinks.map(link => link.siteSection);
  const siteSection = document.tags.find(tag =>
    siteSections.includes(tag as SiteSection)
  ) as SiteSection;

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
    uid: document.uid,
    format: transformFormat(document),
    ...genericFields,
    introText,
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
