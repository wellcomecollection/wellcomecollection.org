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
import { toLink as toImagesLink } from '@weco/common/views/components/ImagesLink/ImagesLink';
import { toLink as toWorksLink } from '@weco/common/views/components/WorksLink/WorksLink';

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
import { arrow } from '@weco/common/icons';
import Space from '@weco/common/views/components/styled/Space';
import TabNavV2 from '@weco/common/views/components/TabNav/TabNavV2';
import { font } from '@weco/common/utils/classnames';
import { LinkProps } from 'next/link';

type Props = {
  conceptResponse: ConceptType;
  worksAbout: CatalogueResultsList<WorkType> | undefined;
  worksBy: CatalogueResultsList<WorkType> | undefined;
  imagesAbout: CatalogueResultsList<ImageType> | undefined;
  imagesBy: CatalogueResultsList<ImageType> | undefined;
};

const leadingColor = 'yellow';

const ConceptHero = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color(leadingColor, 'light')};
`;

const HeroTitle = styled.h1.attrs({ className: font('intb', 1) })`
  margin-bottom: 1rem;
`;

const TypeLabel = styled.span.attrs({ className: font('intr', 6) })`
  background-color: ${props => props.theme.color('cream', 'dark')};
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
  background-color: ${({ hasWorksTabs }) =>
    // todo add this colour to palette to replace paler yellow? or keep both?
    hasWorksTabs ? '#fbfaf4' : 'white'};
`;

const SeeMoreButton = ({ text, link }: { text: string; link: LinkProps }) => (
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
    // TODO fill meta information; wait for confirmation on description
    <CataloguePageLayout
      title={conceptResponse.label}
      description={`Find out more about ${conceptResponse.label} by browsing related works and images from Wellcome Collection.`}
      url={{ pathname: `/concepts/${conceptResponse.id}`, query: {} }}
      openGraphType="website"
      siteSection="collections"
      jsonLd={{ '@type': 'WebPage' }}
      hideNewsletterPromo={true}
    >
      <ConceptHero>
        <div className="container">
          <TypeLabel>{conceptResponse.type}</TypeLabel>
          <Space v={{ size: 's', properties: ['margin-top', 'margin-bottom'] }}>
            <HeroTitle>{conceptResponse.label}</HeroTitle>
            {/* TODO get copy from Jonathan */}
            <ConceptDescription className={font('intr', 5)}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              dapibus suscipit enim nec aliquam.
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
              <TabNavV2
                id="images"
                selectedTab={selectedImagesTab}
                items={[
                  {
                    id: 'images-about',
                    text: (
                      <>
                        {`About this ${conceptResponse.type.toLowerCase()} `}
                        <span className="is-hidden-s">{`(${imagesAbout.totalResults})`}</span>
                      </>
                    ),
                    selected: selectedImagesTab === 'images-about',
                  },
                  {
                    id: 'images-by',
                    text: (
                      <>
                        {`By this ${conceptResponse.type.toLowerCase()} `}
                        <span className="is-hidden-s">{`(${imagesBy.totalResults})`}</span>
                      </>
                    ),
                    selected: selectedImagesTab === 'images-by',
                  },
                ]}
                setSelectedTab={setSelectedImagesTab}
                isDarkMode
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
                  <ImageEndpointSearchResults
                    images={imagesAbout}
                    background="transparent"
                  />
                  <Space v={{ size: 'm', properties: ['margin-top'] }}>
                    <SeeMoreButton
                      text={`All images (${imagesAbout.totalResults})`}
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
                  <ImageEndpointSearchResults
                    images={imagesBy}
                    background="transparent"
                  />
                  <SeeMoreButton
                    text={`All images (${imagesBy.totalResults})`}
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
              <h2 className="h2">Works</h2>
              {hasWorksTabs && (
                <TabNavV2
                  id="works"
                  selectedTab={selectedWorksTab}
                  items={[
                    {
                      id: 'works-about',
                      text: (
                        <>
                          {`About this ${conceptResponse.type.toLowerCase()} `}
                          <span className="is-hidden-s">{`(${worksAbout.totalResults})`}</span>
                        </>
                      ),
                      selected: selectedWorksTab === 'works-about',
                    },
                    {
                      id: 'works-by',
                      text: (
                        <>
                          {`By this ${conceptResponse.type.toLowerCase()} `}
                          <span className="is-hidden-s">{`(${worksBy.totalResults})`}</span>
                        </>
                      ),
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
                  {/* TODO modify WorksSearchResults to be used instead when we're ready to use it across */}
                  <WorksSearchResultsV2 works={worksAbout} />
                  <Space v={{ size: 'l', properties: ['padding-top'] }}>
                    <SeeMoreButton
                      text={`All works (${worksAbout.totalResults})`}
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
                  {/* TODO modify WorksSearchResults to be used instead when we're ready to use it across */}
                  <WorksSearchResultsV2 works={worksBy} />
                  <Space v={{ size: 'l', properties: ['padding-top'] }}>
                    <SeeMoreButton
                      text={`All works (${worksBy.totalResults})`}
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
