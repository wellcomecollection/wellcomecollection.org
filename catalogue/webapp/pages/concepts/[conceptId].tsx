import styled from 'styled-components';
import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Link, { LinkProps } from 'next/link';

// Helpers/Utils
import { appError, AppErrorProps } from '@weco/common/services/app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { looksLikeCanonicalId } from '@weco/catalogue/services/wellcome/catalogue';
import { getConcept } from '@weco/catalogue/services/wellcome/catalogue/concepts';
import { getWorks } from '@weco/catalogue/services/wellcome/catalogue/works';
import { getImages } from '@weco/catalogue/services/wellcome/catalogue/images';
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
} from '@weco/catalogue/services/wellcome/catalogue/types';

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
  imagesAbout: CatalogueResultsList<ImageType> | undefined;
  imagesBy: CatalogueResultsList<ImageType> | undefined;
  apiToolbarLinks: ApiToolbarLink[];
  pageview: Pageview;
};

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

type TagLabelType = {
  text: string;
  totalResults: number;
};

const TabLabel = ({ text, totalResults }: TagLabelType) => (
  <>
    {text} <span className="is-hidden-s">({formatNumber(totalResults)})</span>
  </>
);

export const ConceptPage: NextPage<Props> = ({
  conceptResponse,
  worksAbout,
  worksBy,
  imagesAbout,
  imagesBy,
  apiToolbarLinks,
}) => {
  const [selectedWorksTab, setSelectedWorksTab] = useState('works-about');
  const [selectedImagesTab, setSelectedImagesTab] = useState('images-about');

  const hasWorks = !!(worksBy?.totalResults || worksAbout?.totalResults);
  const hasWorksTabs = !!(worksBy?.totalResults && worksAbout?.totalResults);
  const hasImages = !!(imagesBy?.totalResults || imagesAbout?.totalResults);
  const hasImagesTabs = !!(imagesBy?.totalResults && imagesAbout?.totalResults);

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
                items={[
                  {
                    id: 'images-about',
                    text: TabLabel({
                      text: `About this ${conceptResponse.type.toLowerCase()}`,
                      totalResults: imagesAbout.totalResults,
                    }),
                    selected: selectedImagesTab === 'images-about',
                  },
                  {
                    id: 'images-by',
                    text: TabLabel({
                      text: `By this ${conceptResponse.type.toLowerCase()}`,
                      totalResults: imagesBy.totalResults,
                    }),
                    selected: selectedImagesTab === 'images-by',
                  },
                ]}
                setSelectedTab={setSelectedImagesTab}
              />
            )}
            <Space v={{ size: 'l', properties: ['margin-top'] }}>
              {((hasImagesTabs && selectedImagesTab === 'images-about') ||
                (!hasImagesTabs && !!imagesAbout?.totalResults)) && (
                <div
                  role="tabpanel"
                  id="tabpanel-imagesAbout"
                  aria-labelledby="tab-imagesAbout"
                >
                  <ImageEndpointSearchResults images={imagesAbout.results} />
                  <Space v={{ size: 'm', properties: ['margin-top'] }}>
                    <SeeMoreButton
                      text="All images"
                      totalResults={imagesAbout.totalResults}
                      link={toImagesLink(
                        {
                          'source.subjects.label': [conceptResponse.label],
                        },
                        'concept/images_about'
                      )}
                    />
                  </Space>
                </div>
              )}
              {((hasImagesTabs && selectedImagesTab === 'images-by') ||
                (!hasImagesTabs && !!imagesBy?.totalResults)) && (
                <div
                  role="tabpanel"
                  id="tabpanel-imagesBy"
                  aria-labelledby="tab-imagesBy"
                >
                  <ImageEndpointSearchResults images={imagesBy.results} />
                  <SeeMoreButton
                    text="All images"
                    totalResults={imagesBy.totalResults}
                    link={toImagesLink(
                      {
                        'source.contributors.agent.label': [
                          conceptResponse.label,
                        ],
                      },
                      'concept/images_by'
                    )}
                  />
                </div>
              )}
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
                  items={[
                    {
                      id: 'works-about',
                      text: TabLabel({
                        text: `About this ${conceptResponse.type.toLowerCase()}`,
                        totalResults: worksAbout.totalResults,
                      }),
                      selected: selectedWorksTab === 'works-about',
                    },
                    {
                      id: 'works-by',
                      text: TabLabel({
                        text: `By this ${conceptResponse.type.toLowerCase()}`,
                        totalResults: worksBy.totalResults,
                      }),
                      selected: selectedWorksTab === 'works-by',
                    },
                  ]}
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
            <div className="container">
              {((hasWorksTabs && selectedWorksTab === 'works-about') ||
                (!hasWorksTabs && !!worksAbout?.totalResults)) && (
                <div
                  role="tabpanel"
                  id="tabpanel-worksAbout"
                  aria-labelledby="tab-worksAbout"
                >
                  <WorksSearchResults works={worksAbout.results} />
                  <Space v={{ size: 'l', properties: ['padding-top'] }}>
                    <SeeMoreButton
                      text="All works"
                      totalResults={worksAbout.totalResults}
                      link={toWorksLink(
                        {
                          'subjects.label': [conceptResponse.label],
                        },
                        'concept/works_about'
                      )}
                    />
                  </Space>
                </div>
              )}
              {((hasWorksTabs && selectedWorksTab === 'works-by') ||
                (!hasWorksTabs && !!worksBy?.totalResults)) && (
                <div
                  role="tabpanel"
                  id="tabpanel-worksBy"
                  aria-labelledby="tab-worksBy"
                >
                  <WorksSearchResults works={worksBy.results} />
                  <Space v={{ size: 'l', properties: ['padding-top'] }}>
                    <SeeMoreButton
                      text="All works"
                      totalResults={worksBy.totalResults}
                      link={toWorksLink(
                        {
                          'contributors.agent.label': [conceptResponse.label],
                        },
                        'concept/works_by'
                      )}
                    />
                  </Space>
                </div>
              )}
            </div>
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

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
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

  const worksAboutPromise = getWorks({
    params: { 'subjects.label': [conceptResponse.label] },
    toggles: serverData.toggles,
    pageSize: 5,
  });

  const worksByPromise = getWorks({
    params: { 'contributors.agent.label': [conceptResponse.label] },
    toggles: serverData.toggles,
    pageSize: 5,
  });

  const imagesAboutPromise = getImages({
    params: { 'source.subjects.label': [conceptResponse.label] },
    toggles: serverData.toggles,
    pageSize: 10,
  });

  const imagesByPromise = getImages({
    params: { 'source.contributors.agent.label': [conceptResponse.label] },
    toggles: serverData.toggles,
    pageSize: 10,
  });

  const [
    worksAboutResponse,
    worksByResponse,
    imagesAboutResponse,
    imagesByResponse,
  ] = await Promise.all([
    worksAboutPromise,
    worksByPromise,
    imagesAboutPromise,
    imagesByPromise,
  ]);

  const worksAbout =
    worksAboutResponse.type === 'Error' ? undefined : worksAboutResponse;
  const worksBy =
    worksByResponse.type === 'Error' ? undefined : worksByResponse;
  const imagesAbout =
    imagesAboutResponse.type === 'Error' ? undefined : imagesAboutResponse;
  const imagesBy =
    imagesByResponse.type === 'Error' ? undefined : imagesByResponse;

  const apiToolbarLinks = createApiToolbarLinks(conceptResponse);

  return {
    props: removeUndefinedProps({
      conceptResponse,
      worksAbout,
      worksBy,
      imagesAbout,
      imagesBy,
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
