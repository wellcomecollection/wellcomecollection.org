import { NextPage } from 'next';
import { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { FunctionComponent, JSX, useMemo, useState } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { pageDescriptionConcepts } from '@weco/common/data/microcopy';
import { ImagesLinkSource } from '@weco/common/data/segment-values';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import {
  capitalize,
  dasherize,
  formatNumber,
} from '@weco/common/utils/grammar';
import { ReturnedResults } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import { themeValues } from '@weco/common/views/themes/config';
import theme from '@weco/common/views/themes/default';
import {
  Concept as ConceptType,
  Image as ImageType,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { Link } from '@weco/content/types/link';
import {
  allRecordsLinkParams,
  conceptTypeDisplayName,
} from '@weco/content/utils/concepts';
import CatalogueImageGallery from '@weco/content/views/components/CatalogueImageGallery';
import ImageModal, {
  useExpandedImage,
} from '@weco/content/views/components/ImageModal';
import InPageNavigation from '@weco/content/views/components/InPageNavigation';
import MoreLink from '@weco/content/views/components/MoreLink';
import { toLink as toImagesLink } from '@weco/content/views/components/SearchPagesLink/Images';
import { toLink as toWorksLink } from '@weco/content/views/components/SearchPagesLink/Works';
import Tabs from '@weco/content/views/components/Tabs';
import WorksSearchResults from '@weco/content/views/components/WorksSearchResults';
import CataloguePageLayout from '@weco/content/views/layouts/CataloguePageLayout';

import Collaborators from './concept.Collaborators';
import Header from './concept.Header';
import {
  getThemeSectionHeading,
  SectionData,
  ThemePageSectionsData,
  themeTabOrder,
} from './concept.helpers';
import ImagesResults from './concept.ImagesResults';
import RelatedConceptsGroup from './concept.RelatedConceptsGroup';
import {
  ConceptHero,
  ConceptImages,
  ConceptWorksHeader,
  HeroTitle,
  HotJarPlaceholder,
  MobileNavBackground,
  NavGridCell,
  StretchWrapper,
  TypeLabel,
} from './concept.styles';
import WorksResults from './concept.WorksResults';

const linkSources = new Map([
  ['worksAbout', 'concept/works_about'],
  ['worksBy', 'concept/works_by'],
  ['worksIn', 'concept/works_in'],
  ['imagesAbout', 'concept/images_about'],
  ['imagesBy', 'concept/images_by'],
  ['imagesIn', 'concept/images_in'],
]);

// tabDefinitions is an ordered list of the image or works tabs in a page.
// (hence not just having an object and doing a [selectedTab] lookup)
// Return the currently selected one.
function currentTabPanel<T>(
  selectedTab: string,
  tabDefinitions: PageSectionDefinition<T>[]
) {
  // When only one tab exists, there is no selection going on, just return it.
  if (tabDefinitions.length === 1) return tabDefinitions[0].panel;

  for (const definition in tabDefinitions) {
    if (tabDefinitions[definition].id === selectedTab) {
      return tabDefinitions[definition].panel;
    }
  }
  throw new Error(
    `Unexpected selected tab ${selectedTab} not found in ${tabDefinitions}`
  );
}

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
  />
);

type ImagesTabPanelProps = {
  id: string;
  link: LinkProps;
  results: ReturnedResults<ImageType>;
  totalResults?: number;
};
const ImagesTabPanel: FunctionComponent<ImagesTabPanelProps> = ({
  id,
  link,
  results,
  totalResults,
}) => {
  return (
    <div role="tabpanel" id={`tabpanel-${id}`} aria-labelledby={`tab-${id}`}>
      <CatalogueImageGallery images={results.pageResults} variant="justified" />
      <Space $v={{ size: 'm', properties: ['margin-top'] }}>
        {!!totalResults && (
          <SeeMoreButton
            text="All images"
            totalResults={totalResults}
            link={link}
          />
        )}
      </Space>
    </div>
  );
};

type WorksTabPanelProps = {
  id: string;
  link: LinkProps;
  results: ReturnedResults<WorkBasic>;
  totalResults?: number;
};
const WorksTabPanel: FunctionComponent<WorksTabPanelProps> = ({
  id,
  link,
  results,
  totalResults,
}) => {
  return (
    <Container>
      <div role="tabpanel" id={`tabpanel-${id}`} aria-labelledby={`tab-${id}`}>
        <WorksSearchResults works={results.pageResults} />
        <Space $v={{ size: 'l', properties: ['padding-top'] }}>
          {!!totalResults && (
            <SeeMoreButton
              text="All works"
              totalResults={totalResults}
              link={link}
            />
          )}
        </Space>
      </div>
    </Container>
  );
};

// Represents the data for a single tab/tab panel combination.
type PageSectionDefinition<T> = {
  id: string;
  tab: {
    id: string;
    text: JSX.Element;
  };
  panel: {
    id: string;
    link: LinkProps;
    results: ReturnedResults<T>;
    totalResults?: number;
  };
};

type PageSectionDefinitionProps<T> = {
  tabId: string;
  link: LinkProps;
  resultsGroup?: ReturnedResults<T>;
  tabLabelText: string;
  totalResults?: number;
};

function toPageSectionDefinition<T>({
  tabId,
  link,
  resultsGroup,
  tabLabelText,
  totalResults,
}: PageSectionDefinitionProps<T>): PageSectionDefinition<T> | undefined {
  return resultsGroup?.totalResults
    ? {
        id: tabId,
        tab: {
          id: tabId,
          text: (
            <>
              {tabLabelText}{' '}
              <span className="is-hidden-s">
                ({formatNumber(resultsGroup.totalResults)})
              </span>
            </>
          ),
        },
        panel: { id: tabId, link, results: resultsGroup, totalResults },
      }
    : undefined;
}

export type Props = {
  conceptResponse: ConceptType;
  sectionsData: ThemePageSectionsData;
  apiToolbarLinks: ApiToolbarLink[];
};

const ConceptPage: NextPage<Props> = ({
  conceptResponse,
  sectionsData,
  apiToolbarLinks,
}) => {
  const allImages = useMemo(
    () =>
      themeTabOrder
        .map(tab => sectionsData[tab].images?.pageResults || [])
        .flat(),
    [sectionsData]
  );
  const { newThemePages, themePagesAllFields } = useToggles();
  const { isEnhanced } = useAppContext();
  const [expandedImage, setExpandedImage] = useExpandedImage(allImages);

  const pathname = usePathname();
  const worksTabs = themeTabOrder
    .map(relationship => {
      const tabId = `works${capitalize(relationship)}`;

      const data = sectionsData[relationship] as SectionData;

      return toPageSectionDefinition<WorkBasic>({
        tabId,
        resultsGroup: data.works,
        tabLabelText: data.label,
        totalResults: data.totalResults.works,
        link: toWorksLink(
          allRecordsLinkParams(tabId, conceptResponse),
          linkSources[tabId]
        ),
      });
    })
    .filter(e => !!e) as PageSectionDefinition<WorkBasic>[];

  const hasWorks = worksTabs.length > 0;
  const hasWorksTabs = worksTabs.length > 1;

  const imagesTabs: PageSectionDefinition<ImageType>[] = themeTabOrder
    .map(relationship => {
      const tabId = `images${relationship
        .charAt(0)
        .toUpperCase()}${relationship.slice(1)}`;

      return toPageSectionDefinition({
        tabId,
        resultsGroup: sectionsData[relationship].images,
        tabLabelText: sectionsData[relationship].label,
        totalResults: sectionsData[relationship].totalResults.images,
        link: toImagesLink(
          allRecordsLinkParams(tabId, conceptResponse),
          `${linkSources[tabId]}_${pathname}` as ImagesLinkSource
        ),
      });
    })
    .filter(e => !!e) as PageSectionDefinition<ImageType>[];

  const hasImages = imagesTabs.length > 0;
  const hasImagesTabs = imagesTabs.length > 1;

  // Set the default tab in each group to the first populated tab
  // the two tabs lists are ordered consistently as defined by themeTabOrder,
  // which is ordered so that the more specific tabs come first.
  // Maximally one "more specific" tab is expected to be populated for any given concept.
  const [selectedWorksTab, setSelectedWorksTab] = useState(
    worksTabs[0]?.id || ''
  );
  const [selectedImagesTab, setSelectedImagesTab] = useState(
    imagesTabs[0]?.id || ''
  );

  const { frequentCollaborators, relatedTopics } =
    conceptResponse.relatedConcepts || {};
  const relatedConceptsGroupLabel = 'Related topics';
  const personOrAllFields =
    conceptResponse.type === 'Person' || themePagesAllFields;
  const buildNavLinks = () => {
    const links: Link[] = [];

    // Add image sections
    for (const section of themeTabOrder) {
      if (sectionsData[section].images?.totalResults) {
        links.push({
          text: `Images ${getThemeSectionHeading(section, conceptResponse, true)}`,
          url: `#images-${section}`,
        });
      }
    }

    // Add works section
    if (hasWorks) {
      links.push({ text: 'Works', url: '#works' });
    }

    // Add frequent collaborators
    if (frequentCollaborators?.length && personOrAllFields) {
      links.push({
        text: 'Frequent collaborators',
        url: '#frequent-collaborators',
      });
    }

    // Add related topics
    if (relatedTopics?.length && personOrAllFields) {
      links.push({
        text: relatedConceptsGroupLabel,
        url: `#${dasherize(relatedConceptsGroupLabel)}`,
      });
    }

    return links;
  };

  const navLinks = buildNavLinks();

  return newThemePages ? (
    <>
      <CataloguePageLayout
        title={conceptResponse.label}
        description={pageDescriptionConcepts(conceptResponse.label)}
        url={{ pathname: `/concepts/${conceptResponse.id}`, query: {} }}
        openGraphType="website"
        siteSection="collections"
        jsonLd={{ '@type': 'WebPage' }}
        hideNewsletterPromo={true}
        apiToolbarLinks={apiToolbarLinks}
        clipOverflowX={true}
      >
        <Header concept={conceptResponse} />

        <>
          <WobblyEdge backgroundColor={hasImages ? 'neutral.700' : 'white'} />
          <MobileNavBackground $isOnWhite={!hasImages} />
        </>

        <Container>
          <Grid style={{ background: 'white', rowGap: 0 }}>
            <NavGridCell
              $isOnWhite={!hasImages}
              $isEnhanced={isEnhanced}
              $sizeMap={{ s: [12], m: [12], l: [3], xl: [2] }}
            >
              <InPageNavigation
                isOnWhite={!hasImages}
                links={navLinks}
                variant="sticky"
              />
            </NavGridCell>

            <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [10] }}>
              <StretchWrapper>
                <ImagesResults
                  sectionsData={sectionsData}
                  concept={conceptResponse}
                />
              </StretchWrapper>
              <WorksResults
                concept={conceptResponse}
                sectionsData={sectionsData}
              />

              {(conceptResponse.type === 'Person' || themePagesAllFields) && (
                <>
                  <Space
                    $v={{
                      size: 'xl',
                      properties: ['margin-top', 'margin-bottom'],
                    }}
                  >
                    <Collaborators concepts={frequentCollaborators} />
                  </Space>
                  <Space
                    $v={{
                      size: 'xl',
                      properties: ['margin-top', 'margin-bottom'],
                    }}
                  >
                    <RelatedConceptsGroup
                      dataGtmTriggerName="related_topics"
                      label={relatedConceptsGroupLabel}
                      labelType="heading"
                      relatedConcepts={relatedTopics}
                      buttonColors={
                        themeValues.buttonColors.silverTransparentBlack
                      }
                    />
                  </Space>
                </>
              )}
              {
                // This is a placeholder for the Hotjar embedded survey to be injected
                // when the concept is a Person. It should be removed when the survey
                // is no longer used.
              }
              {conceptResponse.type === 'Person' && (
                <HotJarPlaceholder id="hotjar-embed-placeholder-concept-person" />
              )}
            </GridCell>
          </Grid>
        </Container>
      </CataloguePageLayout>

      {/* https://frontendmasters.com/blog/containers-context/
      A Safari bug is forcing this to live here instead of its parent, ImageResults. 
      The bug got fixed in Safari 18.2 (I think) but we support the latest two versions. 
      It would be nice to move it back inside ImageResults once we're two versions ahead. */}
      <ImageModal
        images={allImages}
        expandedImage={expandedImage}
        setExpandedImage={setExpandedImage}
      />
    </>
  ) : (
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
        <Container>
          <TypeLabel>{conceptTypeDisplayName(conceptResponse)}</TypeLabel>
          <Space
            $v={{ size: 's', properties: ['margin-top', 'margin-bottom'] }}
          >
            <HeroTitle>{conceptResponse.label}</HeroTitle>
          </Space>
        </Container>
      </ConceptHero>

      {hasImages && (
        <ConceptImages as="section" data-testid="images-section">
          <Container>
            <h2 className={`${font('wb', 3)} sectionTitle`}>Images</h2>
            {hasImagesTabs && (
              <Tabs
                label="Images tabs"
                tabBehaviour="switch"
                items={imagesTabs.map(t => t.tab)}
                selectedTab={selectedImagesTab}
                setSelectedTab={setSelectedImagesTab}
                isWhite
                trackWithSegment
              />
            )}
            <Space $v={{ size: 'l', properties: ['margin-top'] }}>
              <ImagesTabPanel
                {...currentTabPanel(selectedImagesTab, imagesTabs)}
              />
            </Space>
          </Container>
        </ConceptImages>
      )}

      {hasWorks && (
        <>
          <ConceptWorksHeader $hasWorksTabs={hasWorksTabs}>
            <Container>
              <h2 className={font('wb', 3)}>Catalogue</h2>
              {hasWorksTabs && (
                <Tabs
                  label="Works tabs"
                  tabBehaviour="switch"
                  selectedTab={selectedWorksTab}
                  items={worksTabs.map(t => t.tab)}
                  setSelectedTab={setSelectedWorksTab}
                  trackWithSegment
                  hideBorder
                />
              )}
            </Container>
          </ConceptWorksHeader>
          <Space
            as="section"
            $v={{
              size: 'xl',
              properties: ['margin-top', 'margin-bottom'],
            }}
            data-testid="works-section"
          >
            <WorksTabPanel {...currentTabPanel(selectedWorksTab, worksTabs)} />
          </Space>
        </>
      )}

      {
        // This is a placeholder for the Hotjar embedded survey to be injected
        // when the concept is a Person. It should be removed when the survey
        // is no longer used.
      }
      {conceptResponse.type === 'Person' && (
        <Container>
          <HotJarPlaceholder id="hotjar-embed-placeholder-concept-person" />
        </Container>
      )}
    </CataloguePageLayout>
  );
};

export default ConceptPage;
