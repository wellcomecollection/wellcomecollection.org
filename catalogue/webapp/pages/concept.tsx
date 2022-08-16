import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { appError, AppErrorProps } from '@weco/common/views/pages/_app';

// Helpers/Utils
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { isString } from '@weco/common/utils/array';
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
import { grid, font } from '@weco/common/utils/classnames';
import { arrow } from '@weco/common/icons';
import Space from '@weco/common/views/components/styled/Space';
import TabNav from '@weco/common/views/components/TabNav/TabNav';

type Props = {
  conceptResponse: ConceptType;
  worksAbout: CatalogueResultsList<WorkType> | undefined;
  worksBy: CatalogueResultsList<WorkType> | undefined;
  images: CatalogueResultsList<ImageType> | undefined;
};

const leadingColor = 'newPaletteYellow';

const ConceptHero = styled(Space)`
  background-color: ${props => props.theme.color(leadingColor)};

  h1 {
    font-size: 4rem;
    margin-bottom: 2.5rem;
  }
`;
const ConceptImages = styled(Space)`
  background-color: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};

  .sectionTitle {
    font-size: 1.75rem;
    margin-bottom: 1.875rem;
  }
`;

const ConceptWorksHeader = styled(Space)<{ hasWorksTabs: boolean }>`
  background-color: ${({ hasWorksTabs }) =>
    hasWorksTabs ? '#fbfaf4' : 'white'};

  .sectionTitle {
    font-size: 1.75rem;
    margin-bottom: 1.875rem;
  }
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
  // "type": "Person|Subject|Organisation|Place",

  // Everything above here is stuff I'm pretty sure we'll need;
  // everything below it is more nebulous and more likely to change
  // in the final API.

  description:
    'Florence Nightingale was an English social reformer, statistician and the founder of modern nursing. Nightingale came to prominence while serving as a manager and trainer of nurses during the Crimean War, in which she organised care for wounded soldiers at Constantinople.',

  // not locations
  urls: [
    {
      label: 'Read more on Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Florence_Nightingale',
    },
  ],

  // cf productionEvent?
  // "dates": [ { date, meaning } ],
  // "places": [ { place, meaning } ],
  // "birthDate/place",
  // "deathDate/place",

  thumbnail: {},

  connectedConcepts: [
    {
      id: 'asoiham1',
      label: 'Crimea',
      type: 'Place',
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
    // TODO remove border-radius?
    // TODO make this work
    colors={{
      border: leadingColor,
      background: leadingColor,
      text: 'black',
    }}
  />
);

export const ConceptPage: NextPage<Props> = ({
  conceptResponse,
  worksAbout,
  worksBy,
  images,
}) => {
  const [selectedTab, setSelectedTab] = useState('works-about');
  const handleTabChange = id => {
    if (selectedTab !== id) setSelectedTab(id);
  };

  const hasWorksTabs = !!worksBy?.totalResults && !!worksAbout?.totalResults;

  return (
    // TODO fill meta information; who decides this?
    <CataloguePageLayout
      title={conceptResponse.label}
      description={'<TBC>'}
      url={{ pathname: `/concepts/${conceptResponse.id}`, query: {} }}
      openGraphType={'website'}
      siteSection={'collections'}
      jsonLd={{ '@type': 'WebPage' }}
      hideNewsletterPromo={true}
    >
      <ConceptHero
        v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
        h={{ size: 'xl', properties: ['padding-left', 'padding-right'] }}
        className="grid"
      >
        <div className={grid({ m: 12, l: 6, xl: 6 })}>
          <h1 className="font-hnb">{conceptResponse.label}</h1>
          {/* TODO dynamise */}
          {FAKE_DATA.description && (
            <p className={font('hnr', 4)}>{FAKE_DATA.description}</p>
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
                  className={font('hnr', 6)}
                >
                  {link.label} ↗
                </a>
              );
            })}
        </div>
      </ConceptHero>

      <ConceptImages
        as="section"
        v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
        h={{ size: 'xl', properties: ['padding-left'] }}
      >
        <h2 className="sectionTitle">Images</h2>
        {images && images.totalResults ? (
          <>
            <ImageEndpointSearchResults isScroller={true} images={images} />
            <SeeMoreButton
              text={`All images (${images.totalResults})`}
              link={`/images?source.subjects.label=${conceptResponse.label}`}
            />
          </>
        ) : (
          <p>There are no matching images</p>
        )}
      </ConceptImages>

      <ConceptWorksHeader
        as="div"
        v={{ size: 'xl', properties: ['padding-top'] }}
        h={{ size: 'xl', properties: ['padding-left', 'padding-right'] }}
        hasWorksTabs={hasWorksTabs}
      >
        <h2 className="sectionTitle">Works</h2>
        {/* TODO responsive tabs + accessible navigation */}
        {hasWorksTabs && (
          <TabNav
            items={[
              {
                id: 'works-about',
                text: `Works about ${conceptResponse.label} ${
                  worksAbout ? `(${worksAbout.totalResults})` : ''
                }`,
                selected: selectedTab === 'works-about',
                onClick: handleTabChange,
              },
              {
                id: 'works-by',
                text: `Works by ${conceptResponse.label} ${
                  worksBy ? `(${worksBy.totalResults})` : ''
                }`,
                selected: selectedTab === 'works-by',
                onClick: handleTabChange,
              },
            ]}
            color={leadingColor}
          />
        )}
      </ConceptWorksHeader>

      <Space
        as="section"
        v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
        h={{ size: 'xl', properties: ['padding-left', 'padding-right'] }}
      >
        {worksAbout?.totalResults ? (
          selectedTab === 'works-about' && (
            <div role="tabpanel">
              <WorksSearchResultsV2 works={worksAbout} />
              <SeeMoreButton
                text={` All works about ${conceptResponse.label} (${worksAbout.totalResults})`}
                link={`/works?subjects.label=${conceptResponse.label}`}
              />
            </div>
          )
        ) : (
          <p>There are no matching works</p>
        )}
        {worksBy?.totalResults ? (
          selectedTab === 'works-by' && (
            <div role="tabpanel">
              {/* TODO modify WorksSearchResults to be used instead when we're ready to use it across */}
              <WorksSearchResultsV2 works={worksBy} />
              <SeeMoreButton
                text={` All works by ${conceptResponse.label} (${worksBy.totalResults})`}
                link={`/works?subjects.label=${conceptResponse.label}`}
              />
            </div>
          )
        ) : (
          <p>There are no matching works</p>
        )}
      </Space>
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

    if (!isString(id)) {
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

    const imagesPromise = getImages({
      params: { 'source.subjects.label': [conceptResponse.label] },
      toggles: serverData.toggles,
      pageSize: 12,
    });

    const [worksAboutResponse, worksByResponse, imagesResponse] =
      await Promise.all([worksAboutPromise, worksByPromise, imagesPromise]);

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
    const images = imagesResponse.type === 'Error' ? undefined : imagesResponse;

    return {
      props: removeUndefinedProps({
        conceptResponse,
        worksAbout,
        worksBy,
        images,
        serverData,
      }),
    };
  };

export default ConceptPage;
