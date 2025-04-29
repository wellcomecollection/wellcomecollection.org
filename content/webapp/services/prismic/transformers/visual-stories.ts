import * as prismic from '@prismicio/client';

import { SiteSection } from '@weco/common/model/site-section';
import { VisualStoriesDocument as RawVisualStoriesDocument } from '@weco/common/prismicio-types';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import { links as headerLinks } from '@weco/common/views/components/Header';
import { VisualStory } from '@weco/content/types/visual-stories';

import { asText, transformGenericFields } from '.';
import { transformOnThisPage } from './pages';

export function transformVisualStory(
  document: RawVisualStoriesDocument
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
    uid: document.uid,
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
          uid: relatedDocument.uid,
          type: relatedDocument.type,
        }
      : undefined,
    siteSection,
  };
}
