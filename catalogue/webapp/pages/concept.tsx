import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { appError, AppErrorProps } from '@weco/common/views/pages/_app';

// Helpers/Utils
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { looksLikeCanonicalId } from 'services/catalogue';
import { getConcept } from 'services/catalogue/concepts';
import { getWorks } from '../services/catalogue/works';
import { getImages } from 'services/catalogue/images';

// Components
import CataloguePageLayout from 'components/CataloguePageLayout/CataloguePageLayout';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import WorksSearchResultsV2 from '../components/WorksSearchResults/WorksSearchResultsV2';
import ImageEndpointSearchResults from 'components/ImageEndpointSearchResults/ImageEndpointSearchResults';

// Types
import {
  CatalogueResultsList,
  Concept as ConceptType,
  Image as ImageType,
  Work as WorkType,
} from '@weco/common/model/catalogue';

// Styles
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import { arrow } from '@weco/common/icons';
import Space from '@weco/common/views/components/styled/Space';
import TabNavV2 from '@weco/common/views/components/TabNav/TabNavV2';

type Props = {
  conceptResponse: ConceptType;
  worksAbout: CatalogueResultsList<WorkType> | undefined;
  worksBy: CatalogueResultsList<WorkType> | undefined;
  imagesAbout: CatalogueResultsList<ImageType> | undefined;
  imagesBy: CatalogueResultsList<ImageType> | undefined;
};

const leadingColor = 'yellow';

// TODO use preset styles for h1, are there any with this big a font-size?
const ConceptHero = styled(Space)`
  background-color: ${props => props.theme.newColor('lightYellow')};

  h1 {
    font-size: 3.1875rem;
    line-height: 1.2;
    margin-bottom: 2.125rem;
  }
`;

const ConceptDescription = styled.section`
  max-width: 600px;
`;

const ConceptImages = styled(Space)`
  background-color: ${props => props.theme.newColor('black')};

  .sectionTitle {
    color: ${props => props.theme.newColor('white')};
  }
`;

const ConceptWorksHeader = styled(Space)<{ hasWorksTabs: boolean }>`
  background-color: ${({ hasWorksTabs, theme }) =>
    theme.newColor(hasWorksTabs ? 'warmNeutral.300' : 'white')};
`;

// Taken from https://github.com/wellcomecollection/docs/tree/main/rfcs/050-concepts-api
const FAKE_DATA = {
  id: 'azxzhnuh',
  identifiers: [
    {
      identifierType: 'lc-names',
      value: 'n12345678',
      type: 'Identifier',
    },
  ],

  label: 'Florence Nightingale',
  alternativeLabels: ['The Lady with the Lamp'],

  type: 'Person',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sagittis lacinia mauris id condimentum. Donec elementum dictum urna, id interdum massa imperdiet vel. Phasellus ultricies, lacus vitae efficitur pellentesque, magna ipsum pharetra metus, vel dictum ex enim et purus.',

  // not locations
  urls: [
    {
      label: 'Read more on Wikipedia',
      url: '#',
    },
  ],
};

// TODO change to use ButtonSolid when refactor is over (with David)
const SeeMoreButton = ({ text, link }: { text: string; link: string }) => (
  <ButtonSolidLink
    text={text}
    link={link}
    icon={arrow}
    isIconAfter={true}
    colors={{
      border: leadingColor,
      background: leadingColor,
      text: 'black',
    }}
    hoverUnderline={true}
  />
);

export const ConceptPage: NextPage<Props> = ({
  conceptResponse,
  worksAbout,
  worksBy,
  imagesAbout,
  imagesBy,
}) => {
  const [selectedWorksTab, setSelectedWorksTab] = useState('works-about');
  const [selectedImagesTab, setSelectedImagesTab] = useState('images-about');

  const hasWorks = !!(worksBy?.totalResults || worksAbout?.totalResults);
  const hasWorksTabs = !!(worksBy?.totalResults && worksAbout?.totalResults);
  const hasImages = !!(imagesBy?.totalResults || imagesAbout?.totalResults);
  const hasImagesTabs = !!(imagesBy?.totalResults && imagesAbout?.totalResults);

  return (
    // TODO fill meta information; who decides this?
    <CataloguePageLayout
      title={conceptResponse.label}
      description="<TBC>"
      url={{ pathname: `/concepts/${conceptResponse.id}`, query: {} }}
      openGraphType="website"
      siteSection="collections"
      jsonLd={{ '@type': 'WebPage' }}
      hideNewsletterPromo={true}
    >
      <ConceptHero
        v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
      >
        <div className="container">
          <ConceptDescription>
            <h1 className="font-intb">{conceptResponse.label}</h1>
            {/* TODO dynamise */}
            {FAKE_DATA.description && (
              <p className="font-size-5">{FAKE_DATA.description}</p>
            )}
            {/* TODO dynamise */}
            {FAKE_DATA.urls?.length > 0 &&
              FAKE_DATA.urls.map(link => {
                /* TODO Could they be internal links? Check if external to display arrow, decide on rel. */
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    rel="nofollow"
                    className={font('intr', 6)}
                  >
                    {link.label} ↗
                  </a>
                );
              })}
          </ConceptDescription>
        </div>
      </ConceptHero>

      {hasImages && (
        <ConceptImages
          as="section"
          v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
        >
          <div className="container">
            <h2 className={`sectionTitle ${font('wb', 3)}`}>Images</h2>

            {hasImagesTabs && (
              <TabNavV2
                items={[
                  {
                    id: 'images-about',
                    text: `Images about ${conceptResponse.label} ${
                      imagesAbout ? `(${imagesAbout.totalResults})` : ''
                    }`,
                    selected: selectedImagesTab === 'images-about',
                  },
                  {
                    id: 'images-by',
                    text: `Images by ${conceptResponse.label} ${
                      imagesBy ? `(${imagesBy.totalResults})` : ''
                    }`,
                    selected: selectedImagesTab === 'images-by',
                  },
                ]}
                // TODO do we want to change these? Decide when we land on a color
                // color={leadingColor}
                setSelectedTab={setSelectedImagesTab}
                isDarkMode
              />
            )}
            <Space v={{ size: 'l', properties: ['margin-top'] }}>
              {((hasImagesTabs && selectedImagesTab === 'images-about') ||
                (!hasImagesTabs && !!imagesAbout?.totalResults)) && (
                <>
                  <ImageEndpointSearchResults
                    images={imagesAbout}
                    background="transparent"
                  />
                  <Space v={{ size: 'm', properties: ['margin-top'] }}>
                    <SeeMoreButton
                      text={`All images (${imagesAbout.totalResults})`}
                      link={`/images?source.subjects.label=${conceptResponse.label}`}
                    />
                  </Space>
                </>
              )}
              {((hasImagesTabs && selectedImagesTab === 'images-by') ||
                (!hasImagesTabs && !!imagesBy?.totalResults)) && (
                <>
                  <ImageEndpointSearchResults
                    images={imagesBy}
                    background="transparent"
                  />
                  <SeeMoreButton
                    text={`All images (${imagesBy.totalResults})`}
                    link={`/images?source.subjects.label=${conceptResponse.label}`}
                  />
                </>
              )}
            </Space>
          </div>
        </ConceptImages>
      )}

      {hasWorks && (
        <>
          <ConceptWorksHeader
            as="div"
            v={{ size: 'xl', properties: ['padding-top'] }}
            hasWorksTabs={hasWorksTabs}
          >
            <div className="container">
              <h2 className={`${font('wb', 3)}`}>Works</h2>
              {/* TODO responsive tabs + accessible navigation */}
              {hasWorksTabs && (
                <TabNavV2
                  items={[
                    {
                      id: 'works-about',
                      text: `Works about ${conceptResponse.label} ${
                        worksAbout ? `(${worksAbout.totalResults})` : ''
                      }`,
                      selected: selectedWorksTab === 'works-about',
                    },
                    {
                      id: 'works-by',
                      text: `Works by ${conceptResponse.label} ${
                        worksBy ? `(${worksBy.totalResults})` : ''
                      }`,
                      selected: selectedWorksTab === 'works-by',
                    },
                  ]}
                  // TODO do we want to change these? Decide when we land on a color
                  // color={leadingColor}
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
                <div role="tabpanel">
                  {/* TODO modify WorksSearchResults to be used instead when we're ready to use it across */}
                  <WorksSearchResultsV2 works={worksAbout} />
                  <Space v={{ size: 'l', properties: ['padding-top'] }}>
                    <SeeMoreButton
                      text={`All works (${worksAbout.totalResults})`}
                      link={`/works?subjects.label=${conceptResponse.label}`}
                    />
                  </Space>
                </div>
              )}
              {((hasWorksTabs && selectedWorksTab === 'works-by') ||
                (!hasWorksTabs && !!worksBy?.totalResults)) && (
                <div role="tabpanel">
                  {/* TODO modify WorksSearchResults to be used instead when we're ready to use it across */}
                  <WorksSearchResultsV2 works={worksBy} />
                  <Space v={{ size: 'l', properties: ['padding-top'] }}>
                    <SeeMoreButton
                      text={`All works (${worksBy.totalResults})`}
                      link={`/works?subjects.label=${conceptResponse.label}`}
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

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { id } = context.query;

    // Note: These pages don't need to be behind a toggle, but I'm putting them here
    // as a way to test the concepts toggle.
    //
    // We will want a toggle in place for linking to concepts from works pages.
    if (!serverData.toggles.conceptsPages) {
      return { notFound: true };
    }

    if (!looksLikeCanonicalId(id)) {
      return { notFound: true };
    }

    const conceptResponse = await getConcept({
      id,
      toggles: serverData.toggles,
    });

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
      pageSize: 8,
    });

    const imagesByPromise = getImages({
      params: { 'source.contributors.agent.label': [conceptResponse.label] },
      toggles: serverData.toggles,
      pageSize: 8,
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

    const worksAbout =
      worksAboutResponse.type === 'Error' ? undefined : worksAboutResponse;
    const worksBy =
      worksByResponse.type === 'Error' ? undefined : worksByResponse;
    const imagesAbout =
      imagesAboutResponse.type === 'Error' ? undefined : imagesAboutResponse;
    const imagesBy =
      imagesByResponse.type === 'Error' ? undefined : imagesByResponse;

    return {
      props: removeUndefinedProps({
        conceptResponse,
        worksAbout,
        worksBy,
        imagesAbout,
        imagesBy,
        serverData,
      }),
    };
  };

export default ConceptPage;
