import styled from 'styled-components';
import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Link, { LinkProps } from 'next/link';

// Helpers/Utils
import { appError, AppErrorProps } from '@weco/common/services/app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { looksLikeCanonicalId } from '@weco/catalogue/services/catalogue';
import { getConcept } from '@weco/catalogue/services/catalogue/concepts';
import { getWorks } from '@weco/catalogue/services/catalogue/works';
import { getImages } from '@weco/catalogue/services/catalogue/images';
import { toLink as toImagesLink } from '@weco/catalogue/components/ImagesLink';
import { toLink as toWorksLink } from '@weco/catalogue/components/WorksLink';
import { pageDescriptionConcepts } from '@weco/common/data/microcopy';
import { formatNumber } from '@weco/common/utils/grammar';

// Components
import CataloguePageLayout from '@weco/catalogue/components/CataloguePageLayout/CataloguePageLayout';
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import WorksSearchResults from '@weco/catalogue/components/WorksSearchResults/WorksSearchResults';
import ImageEndpointSearchResults from '@weco/catalogue/components/ImageEndpointSearchResults/ImageEndpointSearchResults';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';

// Types
import { IdentifierType } from '@weco/common/model/catalogue';
import {
  CatalogueResultsList,
  Concept as ConceptType,
  Image as ImageType,
  Work as WorkType,
} from '@weco/catalogue/services/catalogue/types';

// Styles
import Space from '@weco/common/views/components/styled/Space';
import TabNav from '@weco/common/views/components/TabNav/TabNav';
import { font } from '@weco/common/utils/classnames';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Pageview } from '@weco/common/services/conversion/track';
import theme from '@weco/common/views/themes/default';

type Props = {
  conceptResponse: ConceptType;
  worksAbout: CatalogueResultsList<WorkType> | undefined;
  worksBy: CatalogueResultsList<WorkType> | undefined;
  worksIn: CatalogueResultsList<WorkType> | undefined;
  imagesAbout: CatalogueResultsList<ImageType> | undefined;
  imagesBy: CatalogueResultsList<ImageType> | undefined;
  imagesIn: CatalogueResultsList<ImageType> | undefined;
  apiToolbarLinks: ApiToolbarLink[];
  pageview: Pageview;
};

const emptyImageResults: CatalogueResultsList<ImageType> = {
  type: 'ResultList',
  pageSize: 10,
  totalPages: 0,
  totalResults: 0,
  results: [],
  nextPage: null,
  prevPage: null,
  _requestUrl: '',
};

const emptyWorkResults: CatalogueResultsList<WorkType> = {
  type: 'ResultList',
  pageSize: 10,
  totalPages: 0,
  totalResults: 0,
  results: [],
  nextPage: null,
  prevPage: null,
  _requestUrl: '',
};

const tabOrder = ['about', 'by', 'in'];
// Definition of the fields used to populate each section
// of the page, and to define the link to the "all" searches.
// Currently, only genres use the id to filter
// the corresponding works.  As we make the identifiers available
// for the other queries, they can be changed here.
// In keeping with our API faceting principles, only the filters that
// do not operate on the id have the full path to the attribute.
const queryKeys = {
  'works-about': { filter: 'subjects.label', fields: ['label'] },
  'works-by': { filter: 'contributors.agent.label', fields: ['label'] },
  'works-in': { filter: 'genres.concepts', fields: ['id', 'sameAs'] },
  'images-about': { filter: 'source.subjects.label', fields: ['label'] },
  'images-by': { filter: 'source.contributors.agent.label', fields: ['label'] },
  'images-in': { filter: 'source.genres.concepts', fields: ['id', 'sameAs'] },
};

const gatherValues = (conceptResponse, fields) => {
  return fields.reduce(
    (acc, current) => acc.concat(conceptResponse[current]),
    []
  );
};

const queryParams = (sectionName: string, conceptResponse: ConceptType) => {
  const queryDefinition = queryKeys[sectionName];
  return {
    [queryDefinition.filter]: gatherValues(
      conceptResponse,
      queryDefinition.fields
    ),
  };
};

const linkSources = new Map([
  ['works-about', 'concept/works_about'],
  ['works-by', 'concept/works_by'],
  ['works-in', 'concept/works_in'],
  ['images-about', 'concept/images_about'],
  ['images-by', 'concept/images_by'],
  ['images-in', 'concept/images_in'],
]);

const ConceptHero = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('lightYellow')};
`;

const HeroTitle = styled.h1.attrs({ className: font('intb', 1) })`
  margin-bottom: 1rem;
`;

// TODO when LabelColor is refactored, maybe switch to using Label?
const TypeLabel = styled.span.attrs({ className: font('intb', 6) })`
  background-color: ${props => props.theme.color('warmNeutral.300')};
  padding: 5px;
`;

const ConceptDescription = styled.section`
  max-width: 600px;
`;

const ConceptImages = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('black')};

  .sectionTitle {
    color: ${props => props.theme.color('white')};
  }
`;

const ConceptWorksHeader = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-top'] },
})<{ hasWorksTabs: boolean }>`
  background-color: ${({ hasWorksTabs, theme }) =>
    theme.color(hasWorksTabs ? 'warmNeutral.300' : 'white')};};
`;

type SeeMoreButtonType = {
  text: string;
  link: LinkProps;
  totalResults: number;
};

const SeeMoreButton = ({ text, link, totalResults }: SeeMoreButtonType) => (
  <MoreLink
    name={`${text} (${formatNumber(totalResults, {
      isCompact: true,
    })})`}
    url={link}
    colors={theme.buttonColors.yellowYellowBlack}
    hoverUnderline
  />
);

type WorksTabPanelType = {
  tabId: string;
  link: LinkProps;
  results: CatalogueResultsList<WorkType>;
};

const WorksTabPanel = ({ tabId, link, results }: WorksTabPanelType) => {
  return (
    <div className="container">
      <div
        role="tabpanel"
        id={`tabpanel-${tabId}`}
        aria-labelledby={`tab-${tabId}`}
      >
        <WorksSearchResults works={results.results} />
        <Space v={{ size: 'l', properties: ['padding-top'] }}>
          <SeeMoreButton
            text="All works"
            totalResults={results.totalResults}
            link={link}
          />
        </Space>
      </div>
    </div>
  );
};

type ImagesTabPanelType = {
  tabId: string;
  link: LinkProps;
  results: CatalogueResultsList<ImageType>;
};

const ImagesTabPanel = ({ tabId, link, results }: ImagesTabPanelType) => {
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
    >
      <ImageEndpointSearchResults images={results.results} />
      <SeeMoreButton
        text="All images"
        totalResults={results.totalResults}
        link={link}
      />
    </div>
  );
};

type TagLabelType = {
  text: string;
  totalResults: number;
};

const TabLabel = ({ text, totalResults }: TagLabelType) => (
  <>
    {text} <span className="is-hidden-s">({formatNumber(totalResults)})</span>
  </>
);

type SectionDefinition = {
  id: string;
  tab: {
    id: string;
    text: JSX.Element;
  };
  panel: {
    id: string;
    link: LinkProps;
    results: CatalogueResultsList<WorkType | ImageType>;
  };
};

const toSectionDefinition = (
  tabId: string,
  resultsGroup: CatalogueResultsList<WorkType | ImageType>,
  tabLabelText: string,
  link: LinkProps
): SectionDefinition | undefined => {
  return resultsGroup?.totalResults
    ? {
        id: tabId,
        tab: {
          id: tabId,
          text: TabLabel({
            text: tabLabelText,
            totalResults: resultsGroup.totalResults,
          }),
        },
        panel: { id: tabId, link: link, results: resultsGroup },
      }
    : undefined;
};

const withSelectedStatus = (selectedTab: string, tabDefinition) => {
  tabDefinition.selected = selectedTab === tabDefinition.id;
  return tabDefinition;
};

const conceptTypeDisplayName = (conceptResponse: ConceptType) => {
  const lower = conceptResponse.type.toLowerCase();
  return lower === 'genre' ? 'type/technique' : lower;
};

const currentTabPanel = (selectedTab: string, tabDefinitions) => {
  if (tabDefinitions.length === 1) return tabDefinitions[0].panel;
  for (const definition in tabDefinitions) {
    if (tabDefinitions[definition].id === selectedTab) {
      return tabDefinitions[definition].panel;
    }
  }
  throw new Error(
    `Unexpected tab ${selectedTab} not found in ${tabDefinitions}`
  );
};

export const ConceptPage: NextPage<Props> = ({
  conceptResponse,
  worksAbout,
  worksBy,
  worksIn,
  imagesAbout,
  imagesBy,
  imagesIn,
  apiToolbarLinks,
}) => {
  const [selectedWorksTab, setSelectedWorksTab] = useState('works-about');
  const [selectedImagesTab, setSelectedImagesTab] = useState('images-about');

  const conceptTypeName = conceptTypeDisplayName(conceptResponse);

  const sectionData = {
    about: [`About this ${conceptTypeName}`, worksAbout, imagesAbout],
    by: [`By this ${conceptTypeName}`, worksBy, imagesBy],
    in: [`Using this ${conceptTypeName}`, worksIn, imagesIn],
  };

  const worksTabs = tabOrder
    .map(relationship => {
      const tabId = `works-${relationship}`;
      return toSectionDefinition(
        tabId,
        sectionData[relationship][1],
        sectionData[relationship][0],
        toWorksLink(queryParams(tabId, conceptResponse), linkSources[tabId])
      );
    })
    .filter(e => !!e);

  const hasWorks = worksTabs.length > 0;
  const hasWorksTabs = worksTabs.length > 1;

  const imagesTabs = tabOrder
    .map(relationship => {
      if (sectionData[relationship][2].totalResults) {
        const tabId = `images-${relationship}`;

        return toSectionDefinition(
          tabId,
          sectionData[relationship][2],
          sectionData[relationship][0],
          toImagesLink(queryParams(tabId, conceptResponse), linkSources[tabId])
        );
      }
      return undefined;
    })
    .filter(e => !!e);

  const hasImages = imagesTabs.length > 0;
  const hasImagesTabs = imagesTabs.length > 1;

  return (
    <CataloguePageLayout
      title={conceptResponse.label}
      description={pageDescriptionConcepts(conceptResponse.label)}
      url={{ pathname: `/concepts/${conceptResponse.id}`, query: {} }}
      openGraphType="website"
      siteSection="collections"
      jsonLd={{ '@type': 'WebPage' }}
      hideNewsletterPromo={true}
      apiToolbarLinks={apiToolbarLinks}
    >
      <ConceptHero>
        <div className="container">
          <TypeLabel>{conceptResponse.type}</TypeLabel>
          <Space v={{ size: 's', properties: ['margin-top', 'margin-bottom'] }}>
            <HeroTitle>{conceptResponse.label}</HeroTitle>
            <ConceptDescription className={font('intr', 5)}>
              <BetaMessage
                message={
                  <>
                    We&rsquo;re working to improve the information on this page.
                    You can <Link href="/user-panel">join our user panel</Link>{' '}
                    or{' '}
                    <Link href="https://roadmap.wellcomecollection.org/">
                      submit an idea
                    </Link>{' '}
                    that would help you use our website.
                  </>
                }
              />
            </ConceptDescription>
          </Space>
        </div>
      </ConceptHero>

      {/* Images */}
      {hasImages && (
        <ConceptImages as="section">
          <div className="container">
            <h2 className="h2 sectionTitle">Images</h2>
            {hasImagesTabs && (
              <TabNav
                id="images"
                selectedTab={selectedImagesTab}
                variant="white"
                items={imagesTabs.map(
                  tabData =>
                    tabData &&
                    withSelectedStatus(selectedImagesTab, tabData.tab)
                )}
                setSelectedTab={setSelectedImagesTab}
              />
            )}
            <Space v={{ size: 'l', properties: ['margin-top'] }}>
              <ImagesTabPanel
                {...currentTabPanel(selectedImagesTab, imagesTabs)}
              />
            </Space>
          </div>
        </ConceptImages>
      )}

      {/* Works */}
      {hasWorks && (
        <>
          <ConceptWorksHeader hasWorksTabs={hasWorksTabs}>
            <div className="container">
              <h2 className="h2">Catalogue</h2>

              {hasWorksTabs && (
                <TabNav
                  id="works"
                  selectedTab={selectedWorksTab}
                  items={worksTabs.map(
                    tabData =>
                      tabData &&
                      withSelectedStatus(selectedWorksTab, tabData.tab)
                  )}
                  setSelectedTab={setSelectedWorksTab}
                />
              )}
            </div>
          </ConceptWorksHeader>

          <Space
            as="section"
            v={{
              size: 'xl',
              properties: ['margin-top', 'margin-bottom'],
            }}
          >
            <WorksTabPanel {...currentTabPanel(selectedWorksTab, worksTabs)} />
          </Space>
        </>
      )}
    </CataloguePageLayout>
  );
};

function getDisplayIdentifierType(identifierType: IdentifierType): string {
  switch (identifierType.id) {
    case 'lc-names':
      return 'LC Names';
    case 'lc-subjects':
      return 'LCSH';
    case 'nlm-mesh':
      return 'MeSH';
    default:
      return identifierType.label;
  }
}

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

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { conceptId } = context.query;

    if (!looksLikeCanonicalId(conceptId)) {
      return { notFound: true };
    }

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

    const getConceptWorks = (sectionName: string) =>
      getWorks({
        params: queryParams(sectionName, conceptResponse),
        toggles: serverData.toggles,
        pageSize: 5,
      });

    const getConceptImages = (sectionName: string) =>
      getImages({
        params: queryParams(sectionName, conceptResponse),
        toggles: serverData.toggles,
        pageSize: 10,
      });

    // Only Genres can have works or images "in" them
    // so don't bother executing this query for other types
    // just pretend that we have.
    const worksInPromise =
      conceptResponse.type === 'Genre'
        ? getConceptWorks('works-in')
        : Promise.resolve(emptyWorkResults);

    const imagesInPromise =
      conceptResponse.type === 'Genre'
        ? getConceptImages('images-in')
        : Promise.resolve(emptyImageResults);

    const [
      worksAboutResponse,
      worksByResponse,
      worksInResponse,
      imagesAboutResponse,
      imagesByResponse,
      imagesInResponse,
    ] = await Promise.all([
      getConceptWorks('works-about'),
      getConceptWorks('works-by'),
      worksInPromise,
      getConceptImages('images-about'),
      getConceptImages('images-by'),
      imagesInPromise,
    ]);

    const worksAbout =
      worksAboutResponse.type === 'Error' ? undefined : worksAboutResponse;
    const worksBy =
      worksByResponse.type === 'Error' ? undefined : worksByResponse;
    const imagesAbout =
      imagesAboutResponse.type === 'Error' ? undefined : imagesAboutResponse;
    const imagesBy =
      imagesByResponse.type === 'Error' ? undefined : imagesByResponse;
    const worksIn =
      worksInResponse.type === 'Error' ? undefined : worksInResponse;
    const imagesIn =
      imagesInResponse.type === 'Error' ? undefined : imagesInResponse;

    const apiToolbarLinks = createApiToolbarLinks(conceptResponse);

    return {
      props: removeUndefinedProps({
        conceptResponse,
        worksAbout,
        worksBy,
        worksIn,
        imagesAbout,
        imagesBy,
        imagesIn,
        apiToolbarLinks,
        serverData,
        pageview: {
          name: 'concept',
          properties: {},
        },
      }),
    };
  };

export default ConceptPage;
