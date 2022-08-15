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
// import theme from '@weco/common/views/themes/default';
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

const ConceptTabs = styled(TabNav)`
  background-color: #fbfaf4;
`;

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

export const ConceptPage: NextPage<Props> = ({
  conceptResponse,
  worksAbout,
  worksBy,
  images,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  // const conceptsJson = JSON.stringify(conceptResponse);
  // const worksAboutJson = JSON.stringify(worksAbout);
  // const worksByJson = JSON.stringify(worksBy);
  // const imagesJson = JSON.stringify(images);

  const tabsItems = [
    {
      text: `Works about ${conceptResponse.label} ${
        worksAbout ? `(${worksAbout.totalResults})` : ''
      }`,
      link: {
        href: {},
        as: {},
      },
      selected: selectedTab === 0,
      onClick: () => {
        if (selectedTab !== 0) {
          setSelectedTab(0);
        }
      },
    },
    {
      text: `Works by ${conceptResponse.label} ${
        worksBy ? `(${worksBy.totalResults})` : ''
      }`,
      link: {
        href: {},
        as: {},
      },
      selected: selectedTab === 1,
      onClick: () => {
        if (selectedTab !== 1) {
          setSelectedTab(1);
        }
      },
    },
  ];

  const hasWorksTabs = tabsItems.length > 1;

  return (
    // TODO fill information
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
        v={{
          size: 'xl',
          properties: ['padding-top', 'padding-bottom'],
        }}
        h={{
          size: 'xl',
          properties: ['padding-left', 'padding-right'],
        }}
        className="grid"
      >
        <div className={grid({ m: 12, l: 6, xl: 6 })}>
          <h1 className="font-hnb">
            {conceptResponse.label || FAKE_DATA.label}
          </h1>
          {/* TODO dynamise */}
          <p className={font('hnr', 4)}>{FAKE_DATA.description}</p>
          {/* TODO dynamise */}
          {/* TODO Check if external to display arrow? */}
          {FAKE_DATA.urls?.length > 0 &&
            FAKE_DATA.urls.map(link => {
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
        v={{
          size: 'xl',
          properties: ['padding-top', 'padding-bottom'],
        }}
        h={{
          size: 'xl',
          properties: ['padding-left'],
        }}
      >
        <h2 className="sectionTitle">Images</h2>
        {images && images.totalResults ? (
          <>
            {/* TODO change component properly to allow for changes */}
            <ImageEndpointSearchResults isScroller={true} images={images} />
            {/* TODO modify component to allow for icons on the right */}
            <ButtonSolidLink
              text={`All images (${images.totalResults})`}
              link={`/images?source.subjects.label=${conceptResponse.label}`}
              icon={arrow}
              // TODO make this work
              // color={theme.color(leadingColor, 'dark')}
            />
          </>
        ) : (
          <p>There are no matching images</p>
        )}
      </ConceptImages>
      <ConceptWorksHeader
        as="div"
        v={{
          size: 'xl',
          properties: ['padding-top'],
        }}
        h={{
          size: 'xl',
          properties: ['padding-left', 'padding-right'],
        }}
        hasWorksTabs={hasWorksTabs}
      >
        <h2 className="sectionTitle">Works</h2>
        {hasWorksTabs && <ConceptTabs items={tabsItems} />}
      </ConceptWorksHeader>

      <Space
        as="section"
        v={{
          size: 'xl',
          properties: ['padding-top', 'padding-bottom'],
        }}
        h={{
          size: 'xl',
          properties: ['padding-left', 'padding-right'],
        }}
      >
        {worksAbout && worksAbout.totalResults ? (
          selectedTab === 0 && (
            <>
              <WorksSearchResultsV2 works={worksAbout} />
              <ButtonSolidLink
                text={` All works about ${conceptResponse.label} (${worksAbout.totalResults})`}
                link={`/works?subjects.label=${conceptResponse.label}`}
                icon={arrow}
                iconPosition="after"
                // TODO make this work
                // color={theme.color(leadingColor, 'dark')}
              />
            </>
          )
        ) : (
          <p>There are no matching works</p>
        )}
        {worksBy && worksBy.totalResults ? (
          selectedTab === 1 && (
            <>
              <WorksSearchResultsV2 works={worksBy} />
              <ButtonSolidLink
                text={` All works by ${conceptResponse.label} (${worksBy.totalResults})`}
                link={`/works?subjects.label=${conceptResponse.label}`}
                icon={arrow}
                iconPosition="after"
                // TODO make this work
                // color={theme.color(leadingColor, 'dark')}
              />
            </>
          )
        ) : (
          <p>There are no matching works</p>
        )}
      </Space>
      {/* <div className="container">
        <p>
          <h2>Debug information</h2>
        </p>
        <p>
          <details>
            <summary>Concepts API response</summary>
            <p>{conceptsJson}</p>
          </details>

          <details>
            <summary>Works API response</summary>
            <p>{worksAboutJson}</p>
          </details>

          <details>
            <summary>Works API response</summary>
            <p>{worksByJson}</p>
          </details>

          <details>
            <summary>Images API response</summary>
            <p>{imagesJson}</p>
          </details>
        </p>
      </div> */}
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
