import * as prismic from '@prismicio/client';
import { VisualStory } from '@weco/content/types/visual-stories';
import { VisualStoryDocument } from '../types/visual-stories';
import { asText, transformGenericFields } from '.';
import { links as headerLinks } from '@weco/common/views/components/Header/Header';
import { transformOnThisPage } from './pages';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { transformContributors } from './contributors';
import { SiteSection } from '@weco/common/views/components/PageLayout/PageLayout';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { transformQuery } from './paginated-results';

export function transformVisualStory(
  document: VisualStoryDocument
): VisualStory {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const siteSections = headerLinks.map(link => link.siteSection);
  const siteSection = document.tags.find(tag =>
    siteSections.includes(tag as SiteSection)
  ) as SiteSection;
  const contributors = transformContributors(document);
  const promo = genericFields.promo;
  const { relatedDocument } = data;

  return {
    type: 'visual-stories',
    ...genericFields,
    contributors,
    onThisPage: data.body ? transformOnThisPage(data.body) : [],
    showOnThisPage: data.showOnThisPage || false,
    promo: promo && promo.image ? promo : undefined,
    datePublished: data.datePublished
      ? transformTimestamp(data.datePublished)
      : undefined,
    relatedDocument:
      relatedDocument && 'id' in relatedDocument
        ? {
            title: asText(relatedDocument.data?.title || ''),
            id: relatedDocument.id,
            type: relatedDocument.type,
          }
        : undefined,
    siteSection,
  };
}
export function transformVisualStories(
  query: prismic.Query<VisualStoryDocument>
): PaginatedResults<VisualStory> {
  // TODO determine ordering?
  const paginatedResult = transformQuery(query, exhibition =>
    transformVisualStory(exhibition)
  );

  return {
    ...paginatedResult,
    results: paginatedResult.results,
  };
}
