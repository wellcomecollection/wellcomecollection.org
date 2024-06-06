import * as prismic from '@prismicio/client';
import { VisualStory } from '@weco/content/types/visual-stories';
import { asText, transformGenericFields } from '.';
import { links as headerLinks } from '@weco/common/views/components/Header/Header';
import { transformOnThisPage } from './pages';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { SiteSection } from '@weco/common/views/components/PageLayout/PageLayout';
import { VisualStoriesDocument } from '@weco/common/prismicio-types';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';

export function transformVisualStory(
  document: VisualStoriesDocument
): VisualStory {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const siteSections = headerLinks.map(link => link.siteSection);
  const siteSection = document.tags.find(tag =>
    siteSections.includes(tag as SiteSection)
  ) as SiteSection;
  const promo = genericFields.promo;
  const { relatedDocument } = data;

  return {
    type: 'visual-stories',
    ...genericFields,
    onThisPage: data.body ? transformOnThisPage(data.body) : [],
    showOnThisPage: data.showOnThisPage || false,
    promo: promo && promo.image ? promo : undefined,
    datePublished: data.datePublished
      ? transformTimestamp(data.datePublished)
      : undefined,
    relatedDocument: isFilledLinkToDocumentWithData(relatedDocument)
      ? {
          title: asText(relatedDocument.data?.title as prismic.RichTextField),
          id: relatedDocument.id,
          type: relatedDocument.type,
        }
      : undefined,
    siteSection,
  };
}
