import { NextPage } from 'next';
import { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { FunctionComponent, JSX, useState } from 'react';

import { pageDescriptionConcepts } from '@weco/common/data/microcopy';
import { ImagesLinkSource } from '@weco/common/data/segment-values';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import { capitalize, formatNumber } from '@weco/common/utils/grammar';
import { ReturnedResults } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import theme from '@weco/common/views/themes/default';
import CatalogueImageGallery from '@weco/content/components/CatalogueImageGallery';
import CataloguePageLayout from '@weco/content/components/CataloguePageLayout';
import MoreLink from '@weco/content/components/MoreLink';
import { toLink as toImagesLink } from '@weco/content/components/SearchPagesLink/Images';
import { toLink as toWorksLink } from '@weco/content/components/SearchPagesLink/Works';
import Tabs from '@weco/content/components/Tabs';
import WorksSearchResults from '@weco/content/components/WorksSearchResults';
import useHotjar from '@weco/content/hooks/useHotjar';
import {
  Concept as ConceptType,
  Image as ImageType,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import {
  allRecordsLinkParams,
  conceptTypeDisplayName,
} from '@weco/content/utils/concepts';

import {
  Collaborators,
  Header,
  ImagesResults,
  RelatedConceptsGroup,
  WorksResults,
} from '.';
import { SectionData, ThemePageSectionsData, themeTabOrder } from './helpers';
import {
  ConceptHero,
  ConceptImages,
  ConceptWorksHeader,
  HeroTitle,
  HotJarPlaceholder,
  TypeLabel,
} from './styles';

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

type TabLabelProps = {
  text: string;
  totalResults: number;
};

const TabLabel = ({ text, totalResults }: TabLabelProps) => (
  <>
    {text} <span className="is-hidden-s">({formatNumber(totalResults)})</span>
  </>
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
          text: TabLabel({
            text: tabLabelText,
            totalResults: resultsGroup.totalResults,
          }),
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
  useHotjar(true);
  const { newThemePages, themePagesAllFields } = useToggles();

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
  // the two tabs lists are ordered consistently as defined by tabOrder,
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
      {newThemePages && <Header concept={conceptResponse} />}
      {!newThemePages && (
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
      )}

      {/* Images */}
      {newThemePages && (
        <ImagesResults sectionsData={sectionsData} concept={conceptResponse} />
      )}

      {!newThemePages && hasImages && (
        <ConceptImages as="section" data-testid="images-section">
          <Container>
            <h2 className={`${font('wb', 3)}`}>Images</h2>
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

      {/* Works */}
      {newThemePages && (
        <WorksResults concept={conceptResponse} sectionsData={sectionsData} />
      )}
      {!newThemePages && hasWorks && (
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

      {newThemePages &&
        (conceptResponse.type === 'Person' || themePagesAllFields) && (
          <Container>
            <Space
              $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
            >
              <Collaborators concepts={frequentCollaborators} />
            </Space>
            <Space
              $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
            >
              <RelatedConceptsGroup
                label="Related topics"
                labelType="heading"
                relatedConcepts={relatedTopics}
                buttonColors={
                  themeValues.buttonColors.pumiceTransparentCharcoal
                }
              />
            </Space>
          </Container>
        )}
      {
        // This is a placeholder for the Hotjar embedded survey to be injected
        // when the concept is a Person. It should be removed when the survey
        // is no longer used.
      }
      {conceptResponse.type === 'Person' && (
        <HotJarPlaceholder id="hotjar-embed-placeholder-concept-person" />
      )}
    </CataloguePageLayout>
  );
};

export default ConceptPage;
