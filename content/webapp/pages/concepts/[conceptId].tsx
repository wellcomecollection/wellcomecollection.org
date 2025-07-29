import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getQueryResults } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import ConceptContext from '@weco/content/contexts/concepts/concept';
import { makeConceptConfig } from '@weco/content/contexts/concepts/concept/concept.config';
import { emptyResultList } from '@weco/content/services/wellcome';
import { looksLikeCanonicalId } from '@weco/content/services/wellcome/catalogue';
import { getConcept } from '@weco/content/services/wellcome/catalogue/concepts';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import {
  CatalogueResultsList,
  Concept as ConceptType,
  Image as ImageType,
  toWorkBasic,
  Work as WorkType,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWorks } from '@weco/content/services/wellcome/catalogue/works';
import {
  allRecordsLinkParams,
  conceptTypeDisplayName,
  getDisplayIdentifierType,
  queryParams,
} from '@weco/content/utils/concepts';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import ConceptPage, {
  Props as ConceptPageProps,
} from '@weco/content/views/pages/concepts/concept';

export const Page: NextPage<ConceptPageProps> = props => {
  const config = makeConceptConfig(props.conceptResponse);

  return (
    <ConceptContext.Provider value={{ config }}>
      <ConceptPage {...props} />
    </ConceptContext.Provider>
  );
};

function createApiToolbarLinks(concept: ConceptType): ApiToolbarLink[] {
  const apiUrl = `https://api.wellcomecollection.org/catalogue/v2/concepts/${concept.id}`;

  const apiLink = {
    id: 'json',
    label: 'JSON',
    link: apiUrl,
  };

  const identifiers = (concept.identifiers || []).map(id =>
    id.identifierType.id === 'label-derived'
      ? {
          id: id.value,
          label: 'Label-derived identifier',
        }
      : {
          id: id.value,
          label: getDisplayIdentifierType(id.identifierType),
          value: id.value,
        }
  );

  return [apiLink, ...identifiers];
}

type Props = ServerSideProps<ConceptPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res, cacheTTL.search);
  const { conceptId } = context.query;

  if (!looksLikeCanonicalId(conceptId)) {
    return { notFound: true };
  }

  const serverData = await getServerData(context);
  const newThemePages = serverData.toggles.newThemePages.value;

  const conceptResponse = await getConcept({
    id: conceptId,
    toggles: serverData.toggles,
  });

  if (conceptResponse.type === 'Error') {
    if (conceptResponse.httpStatus === 404) {
      return { notFound: true };
    }
    return appError(
      context,
      conceptResponse.httpStatus,
      conceptResponse.description
    );
  }

  const getConceptDocs = {
    works: {
      byId: (sectionName: string) =>
        getWorks({
          params: queryParams(sectionName, conceptResponse),
          toggles: serverData.toggles,
          pageSize: 5,
        }),
      byLabel: (sectionName: string) =>
        getWorks({
          params: allRecordsLinkParams(sectionName, conceptResponse),
          toggles: serverData.toggles,
          pageSize: 5,
        }),
    },
    images: {
      byId: (sectionName: string) =>
        getImages({
          params: queryParams(sectionName, conceptResponse),
          toggles: serverData.toggles,
          pageSize: newThemePages ? 12 : 5,
        }),
      byLabel: (sectionName: string) =>
        getImages({
          params: allRecordsLinkParams(sectionName, conceptResponse),
          toggles: serverData.toggles,
          pageSize: newThemePages ? 12 : 5,
        }),
    },
  };

  const worksAboutPromiseById = getConceptDocs.works.byId('worksAbout');
  const imagesAboutPromiseById = getConceptDocs.images.byId('imagesAbout');

  const worksAboutPromiseByLabel = getConceptDocs.works.byLabel('worksAbout');
  const imagesAboutPromiseByLabel =
    getConceptDocs.images.byLabel('imagesAbout');

  const emptyImageResults: CatalogueResultsList<ImageType> = emptyResultList();
  const emptyWorkResults: CatalogueResultsList<WorkType> = emptyResultList();

  // Only Genres can have works or images "in" them
  // so don't bother executing this query for other types
  // just pretend that we have.
  const worksInPromiseById =
    conceptResponse.type === 'Genre'
      ? getConceptDocs.works.byId('worksIn')
      : Promise.resolve(emptyWorkResults);

  const imagesInPromiseById =
    conceptResponse.type === 'Genre'
      ? getConceptDocs.images.byId('imagesIn')
      : Promise.resolve(emptyImageResults);

  const worksInPromiseByLabel =
    conceptResponse.type === 'Genre'
      ? getConceptDocs.works.byLabel('worksIn')
      : Promise.resolve(emptyWorkResults);

  const imagesInPromiseByLabel =
    conceptResponse.type === 'Genre'
      ? getConceptDocs.images.byLabel('imagesIn')
      : Promise.resolve(emptyImageResults);

  // Genres cannot be creators of works or images.
  // Semantically, we could claim that only Agents can be creators
  // but some metonymy exists in the source data, meaning that some
  // concepts that do not strictly have agency are present in
  // the contributor fields.
  // Therefore, we can only really be certain that a Concept
  // is not (and should never be) a contributor when it is a genre.
  const worksByPromiseById =
    conceptResponse.type !== 'Genre'
      ? getConceptDocs.works.byId('worksBy')
      : Promise.resolve(emptyWorkResults);

  const imagesByPromiseById =
    conceptResponse.type !== 'Genre'
      ? getConceptDocs.images.byId('imagesBy')
      : Promise.resolve(emptyImageResults);

  const worksByPromiseByLabel =
    conceptResponse.type !== 'Genre'
      ? getConceptDocs.works.byLabel('worksBy')
      : Promise.resolve(emptyWorkResults);

  const imagesByPromiseByLabel =
    conceptResponse.type !== 'Genre'
      ? getConceptDocs.images.byLabel('imagesBy')
      : Promise.resolve(emptyImageResults);

  const [
    worksAboutResponseById,
    worksByResponseById,
    worksInResponseById,
    imagesAboutResponseById,
    imagesByResponseById,
    imagesInResponseById,

    worksAboutResponseByLabel,
    worksByResponseByLabel,
    worksInResponseByLabel,
    imagesAboutResponseByLabel,
    imagesByResponseByLabel,
    imagesInResponseByLabel,
  ] = await Promise.all([
    worksAboutPromiseById,
    worksByPromiseById,
    worksInPromiseById,
    imagesAboutPromiseById,
    imagesByPromiseById,
    imagesInPromiseById,

    worksAboutPromiseByLabel,
    worksByPromiseByLabel,
    worksInPromiseByLabel,
    imagesAboutPromiseByLabel,
    imagesByPromiseByLabel,
    imagesInPromiseByLabel,
  ]);

  const worksAbout = getQueryResults({
    categoryName: 'works about',
    queryResults: worksAboutResponseById,
  });
  const worksBy = getQueryResults({
    categoryName: 'works by',
    queryResults: worksByResponseById,
  });
  const imagesAbout = getQueryResults({
    categoryName: 'images about',
    queryResults: imagesAboutResponseById,
  });
  const imagesBy = getQueryResults({
    categoryName: 'images by',
    queryResults: imagesByResponseById,
  });
  const worksIn = getQueryResults({
    categoryName: 'works in',
    queryResults: worksInResponseById,
  });
  const imagesIn = getQueryResults({
    categoryName: 'images in',
    queryResults: imagesInResponseById,
  });

  const getLabelTotals = () => {
    const worksAboutByLabelTotalResults = getQueryResults({
      categoryName: 'works about',
      queryResults: worksAboutResponseByLabel,
    })?.totalResults;
    const worksByByLabelTotalResults = getQueryResults({
      categoryName: 'works by',
      queryResults: worksByResponseByLabel,
    })?.totalResults;
    const imagesAboutByLabelTotalResults = getQueryResults({
      categoryName: 'images about',
      queryResults: imagesAboutResponseByLabel,
    })?.totalResults;
    const imagesByByLabelTotalResults = getQueryResults({
      categoryName: 'images by',
      queryResults: imagesByResponseByLabel,
    })?.totalResults;
    const worksInByLabelTotalResults = getQueryResults({
      categoryName: 'works in',
      queryResults: worksInResponseByLabel,
    })?.totalResults;
    const imagesInByLabelTotalResults = getQueryResults({
      categoryName: 'images in',
      queryResults: imagesInResponseByLabel,
    })?.totalResults;

    return {
      worksAbout: worksAboutByLabelTotalResults,
      worksBy: worksByByLabelTotalResults,
      worksIn: worksInByLabelTotalResults,
      imagesAbout: imagesAboutByLabelTotalResults,
      imagesBy: imagesByByLabelTotalResults,
      imagesIn: imagesInByLabelTotalResults,
    };
  };

  const totalResults = getLabelTotals();

  const apiToolbarLinks = createApiToolbarLinks(conceptResponse);

  const conceptTypeName = conceptTypeDisplayName(conceptResponse).toLowerCase();

  const sectionsData = {
    about: {
      label: `About this ${conceptTypeName}`,
      works: worksAbout && {
        ...worksAbout,
        pageResults: worksAbout.pageResults.map(toWorkBasic),
      },
      images: imagesAbout,
      totalResults: {
        works: totalResults.worksAbout,
        images: totalResults.imagesAbout,
      },
    },
    by: {
      label: `By this ${conceptTypeName}`,
      works: worksBy && {
        ...worksBy,
        pageResults: worksBy.pageResults.map(toWorkBasic),
      },
      images: imagesBy,
      totalResults: {
        works: totalResults.worksBy,
        images: totalResults.imagesBy,
      },
    },
    in: {
      label: `Using this ${conceptTypeName}`,
      works: worksIn && {
        ...worksIn,
        pageResults: worksIn.pageResults.map(toWorkBasic),
      },
      images: imagesIn,
      totalResults: {
        works: totalResults.worksIn,
        images: totalResults.imagesIn,
      },
    },
  };

  return {
    props: serialiseProps<Props>({
      conceptResponse,
      sectionsData,
      apiToolbarLinks,
      serverData,
      pageview: {
        name: 'concept',
        properties: {},
      },
    }),
  };
};

export default Page;
