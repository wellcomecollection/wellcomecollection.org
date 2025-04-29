import { SiteSection } from '@weco/common/model/site-section';
import {
  GuideFormatsDocument as RawGuideFormatsDocument,
  GuidesDocument as RawGuidesDocument,
} from '@weco/common/prismicio-types';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { links as headerLinks } from '@weco/common/views/components/Header';
import { Format } from '@weco/content/types/format';
import { Guide } from '@weco/content/types/guides';

import { asHtml, asTitle, transformFormat, transformGenericFields } from '.';
import { transformOnThisPage } from './pages';

export function transformGuide(document: RawGuidesDocument): Guide {
  const { data } = document;
  const genericFields = transformGenericFields(document);

  // TODO (tagging): This is just for now, we will be implementing a proper site tagging
  // strategy for this later
  const siteSections = headerLinks.map(link => link.siteSection);
  const siteSection = document.tags.find(tag =>
    siteSections.includes(tag as SiteSection)
  ) as SiteSection;

  const promo = genericFields.promo;
  return {
    type: 'guides',
    uid: document.uid,
    format: transformFormat(document),
    ...genericFields,
    onThisPage: data.body ? transformOnThisPage(data.body) : [],
    showOnThisPage: data.showOnThisPage || false,
    promo: promo && promo.image ? promo : undefined,
    datePublished: data.datePublished
      ? transformTimestamp(data.datePublished)
      : undefined,
    siteSection,
  };
}

export function transformGuideFormat(
  document: RawGuideFormatsDocument
): Format {
  return {
    id: document.id,
    title: asTitle(document.data.title),
    description: asHtml(document.data.description),
  };
}
