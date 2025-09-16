import { NextPage } from 'next';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { PagesDocument as RawPagesDocument } from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import SearchForm from '@weco/common/views/components/SearchForm';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import * as page from '@weco/content/pages/pages/[pageId]';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { getInsideOurCollectionsCards } from '@weco/content/services/prismic/transformers/collections-landing';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import CollectionsLandingPage, {
  Props as CollectionsLandingPageProps,
} from '@weco/content/views/pages/collections';

export type Concept = {
  id: string;
  label: string;
  displayLabel?: string;
  description?: {
    text: string;
    sourceLabel?: string;
    sourceUrl?: string;
  };
  // ...other fields are available
};

type ConceptsApiResponse = {
  results: Concept[];
  totalResults: number;
};

type ThemeCategory = {
  label: string;
  concepts: string[];
};

type ThemeConfig = {
  categories: ThemeCategory[];
};

async function fetchConceptsByIds(conceptIds: string[]): Promise<Concept[]> {
  if (conceptIds.length === 0) {
    return [];
  }

  try {
    const idsParam = conceptIds.join(',');
    const apiUrl = `https://api.wellcomecollection.org/catalogue/v2/concepts?id=${idsParam}`;

    console.log(`Fetching concepts from: ${apiUrl}`);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch concepts: ${response.status} ${response.statusText}`
      );
    }

    const data: ConceptsApiResponse = await response.json();

    return data.results || [];
  } catch (error) {
    console.error('Error fetching concepts by IDs:', error);
    return [];
  }
}

// TODO need the real concept ids to use
const themeBlockCategories: ThemeConfig = {
  categories: [
    {
      label: 'Featured',
      concepts: ['s7d7wjf3', 'gyh3qjn3', 'kd6svu9u', 'uxms5dmz'],
    },
    {
      label: 'People and organisations',
      concepts: ['a224b9mp', 'a223f5a6', 'a2249bxm'],
    },
    {
      label: 'Techniques',
      concepts: ['a224tns9', 'a224tns9'],
    },
    {
      label: 'Subjects',
      concepts: ['a224tns9', 'a224tns9'],
    },
    {
      label: 'Places',
      concepts: ['a224tns9', 'a224tns9'],
    },
  ],
};

async function fetchFeaturedConcepts(): Promise<Concept[]> {
  try {
    const featuredCategory = themeBlockCategories.categories.find(
      (category: ThemeCategory) => category.label === 'Featured'
    );

    if (!featuredCategory || !featuredCategory.concepts) {
      console.warn('No featured category found in theme config');
      return [];
    }

    return fetchConceptsByIds(featuredCategory.concepts);
  } catch (error) {
    console.error('Error fetching featured concepts:', error);
    return [];
  }
}

const Page: NextPage<
  page.Props | (CollectionsLandingPageProps & { hasNewPageToggle: true })
> = props => {
  return 'hasNewPageToggle' in props ? (
    <CollectionsLandingPage {...props} />
  ) : (
    <page.Page
      {...props}
      staticContent={
        <ContaineredLayout gridSizes={gridSize12()}>
          <SpacingSection>
            <SearchForm
              searchCategory="works"
              location="page"
              showTypewriter={true}
            />
          </SpacingSection>
        </ContaineredLayout>
      }
    />
  );
};

type Props = ServerSideProps<
  page.Props | (CollectionsLandingPageProps & { hasNewPageToggle: true })
>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  const client = createClient(context);
  const newCollectionsLanding = serverData.toggles.collectionsLanding.value;

  if (newCollectionsLanding) {
    const collectionsPagePromise = await fetchPage(
      client,
      prismicPageIds.newCollections
    );
    const collectionsPage = transformPage(
      collectionsPagePromise as RawPagesDocument
    );

    const insideOurCollectionsCards =
      getInsideOurCollectionsCards(collectionsPage);

    // Fetch featured concepts for the theme block
    const featuredConcepts = await fetchFeaturedConcepts();

    return {
      props: serialiseProps({
        hasNewPageToggle: true,
        pageMeta: {
          id: collectionsPage.id,
          image: collectionsPage.promo?.image,
          description: collectionsPage.promo?.caption,
        },
        title: collectionsPage.title,
        introText: collectionsPage.introText ?? [],
        insideOurCollectionsCards,
        featuredConcepts,
        serverData,
      }),
    };
  }

  return page.getServerSideProps({
    ...context,
    query: {
      pageId: newCollectionsLanding
        ? prismicPageIds.newCollections
        : prismicPageIds.collections,
    },
    params: { siteSection: 'collections' },
  });
};
export default Page;
