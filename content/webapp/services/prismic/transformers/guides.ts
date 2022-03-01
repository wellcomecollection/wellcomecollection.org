import { Guide, GuideFormat } from '../../../types/guides';
import {
  GuidePrismicDocument,
  GuideFormatPrismicDocument,
} from '../types/guides';
import {
  asHtml,
  asTitle,
  transformFormat,
  transformGenericFields,
  transformTimestamp,
} from '.';
import { links as headerLinks } from '@weco/common/views/components/Header/Header';
import { transformOnThisPage } from './pages';

export function transformGuide(document: GuidePrismicDocument): Guide {
  const { data } = document;
  const genericFields = transformGenericFields(document);

  // TODO (tagging): This is just for now, we will be implementing a proper site tagging
  // strategy for this later
  const siteSections = headerLinks.map(link => link.siteSection);
  const siteSection = document.tags.find(tag => siteSections.includes(tag));

  const promo = genericFields.promo;
  return {
    type: 'guides',
    format: transformFormat(document),
    ...genericFields,
    onThisPage: data.body ? transformOnThisPage(data.body) : [],
    showOnThisPage: data.showOnThisPage || false,
    promo: promo && promo.image ? promo : undefined,
    datePublished: data.datePublished
      ? transformTimestamp(data.datePublished)
      : undefined,
    siteSection: siteSection,
  };
}

export function transformGuideFormat(
  document: GuideFormatPrismicDocument
): GuideFormat {
  return {
    id: document.id,
    title: asTitle(document.data.title),
    description: asHtml(document.data.description),
  };
}
