import { VisualStory } from '@weco/content/types/visual-stories';
import { VisualStoryDocument } from '../types/visual-stories';
import { transformGenericFields } from '.';
import { links as headerLinks } from '@weco/common/views/components/Header/Header';
import { transformOnThisPage } from './pages';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { transformContributors } from './contributors';
import { SiteSection } from '@weco/common/views/components/PageLayout/PageLayout';

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
    siteSection,
  };
}
