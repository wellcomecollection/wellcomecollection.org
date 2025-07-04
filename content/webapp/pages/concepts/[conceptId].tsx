import { GetServerSideProps, NextPage } from 'next';
import { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { FunctionComponent, JSX, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { pageDescriptionConcepts } from '@weco/common/data/microcopy';
import { ImagesLinkSource } from '@weco/common/data/segment-values';
import { getServerData } from '@weco/common/server-data';
import { useToggles } from '@weco/common/server-data/Context';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import { font } from '@weco/common/utils/classnames';
import {
  capitalize,
  dasherize,
  formatNumber,
} from '@weco/common/utils/grammar';
import { serialiseProps } from '@weco/common/utils/json';
import { getQueryResults, ReturnedResults } from '@weco/common/utils/search';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import { themeValues } from '@weco/common/views/themes/config';
import theme from '@weco/common/views/themes/default';
import CatalogueImageGallery from '@weco/content/components/CatalogueImageGallery';
import CataloguePageLayout from '@weco/content/components/CataloguePageLayout';
import MoreLink from '@weco/content/components/MoreLink';
import OnThisPageAnchors from '@weco/content/components/OnThisPageAnchors';
import { toLink as toImagesLink } from '@weco/content/components/SearchPagesLink/Images';
import { toLink as toWorksLink } from '@weco/content/components/SearchPagesLink/Works';
import Tabs from '@weco/content/components/Tabs';
import ThemeCollaborators from '@weco/content/components/ThemeCollaborators';
import ThemeHeader from '@weco/content/components/ThemeHeader';
import ThemeImages from '@weco/content/components/ThemeImages';
import ThemeRelatedConceptsGroup from '@weco/content/components/ThemeRelatedConceptsGroup';
import ThemeWorks, {
  getThemeTabLabel,
} from '@weco/content/components/ThemeWorks';
import WorksSearchResults from '@weco/content/components/WorksSearchResults';
import { emptyResultList } from '@weco/content/services/wellcome';
import { looksLikeCanonicalId } from '@weco/content/services/wellcome/catalogue';
import { getConcept } from '@weco/content/services/wellcome/catalogue/concepts';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import {
  CatalogueResultsList,
  Concept as ConceptType,
  Image as ImageType,
  toWorkBasic,
  WorkBasic,
  Work as WorkType,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWorks } from '@weco/content/services/wellcome/catalogue/works';
import { Link } from '@weco/content/types/link';
import {
  allRecordsLinkParams,
  conceptTypeDisplayName,
  getDisplayIdentifierType,
  queryParams,
} from '@weco/content/utils/concepts';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';

const emptyImageResults: CatalogueResultsList<ImageType> = emptyResultList();

const emptyWorkResults: CatalogueResultsList<WorkType> = emptyResultList();

const tabOrder = ['by', 'in', 'about'] as const;

const linkSources = new Map([
  ['worksAbout', 'concept/works_about'],
  ['worksBy', 'concept/works_by'],
  ['worksIn', 'concept/works_in'],
  ['imagesAbout', 'concept/images_about'],
  ['imagesBy', 'concept/images_by'],
  ['imagesIn', 'concept/images_in'],
]);

const NavGridCell = styled(GridCell)<{
  $isEnhanced: boolean;
  $isMobileNavInverted: boolean;
}>`
  position: ${props => (props.$isEnhanced ? 'sticky' : 'relative')};
  top: 0;
  transition: background-color ${props => props.theme.transitionProperties};
  background-color: ${props =>
    props.theme.color(props.$isMobileNavInverted ? 'white' : 'neutral.700')};
  z-index: 3;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: ${themeValues.containerPadding.small}px;
    bottom: 0;
    top: 0;
    z-index: 10;
    transition: background-color ${props => props.theme.transitionProperties};
    background-color: ${props =>
      props.theme.color(props.$isMobileNavInverted ? 'white' : 'neutral.700')};
  }

  &::before {
    right: 100%;
  }

  &::after {
    left: 100%;
  }

  ${props =>
    props.theme.media('medium')(`
      &::before,
      &::after {
        width: ${themeValues.containerPadding.medium}px;
      }
  `)}

  ${props => props.theme.media('large')`
    position: unset;
    background-color: unset;
    z-index: unset;
    transition: unset;

    &::before,
    &::after {
      transition: unset;
      display: none;
    }
  `}
`;

const StretchWrapper = styled.div`
  ${props => props.theme.pageGridOffset('margin-right')};

  &::before {
    content: '';
    position: absolute;
    width: calc(100vw - 100%);
    top: 0;
    background: ${props => props.theme.color('neutral.700')};
    bottom: 0;
    right: 100%;
    z-index: 0;
  }
`;

const HotJarPlaceholder = styled.div`
  margin: -2rem auto 2rem;
  width: 100%;
  max-width: ${themeValues.sizes.xlarge}px;

  display: grid;
  justify-items: start;
  padding: 0 ${themeValues.containerPadding.small}px;

  div:has(form) {
    min-width: 250px;
  }

  grid-template-columns: 1fr auto;

  ${themeValues.media('medium')(`
    padding: 0 ${themeValues.containerPadding.medium}px;
    div:has(form) {
      min-width: 350px;
    }
  `)}

  ${themeValues.media('large')(`
    padding: 0 ${themeValues.containerPadding.large}px;
    div:has(form) {
      min-width: 450px;
    }
  `)}
`;

const ConceptHero = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('lightYellow')};
`;

const HeroTitle = styled.h1.attrs({ className: font('intb', 1) })`
  margin-bottom: 1rem;
`;

const TypeLabel = styled.span.attrs({ className: font('intb', 6) })`
  background-color: ${props => props.theme.color('warmNeutral.300')};
  padding: 5px;
`;

const ConceptImages = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('black')};

  .sectionTitle {
    color: ${props => props.theme.color('white')};
  }
`;

type ConceptWorksHeaderProps = {
  $hasWorksTabs: boolean;
};
const ConceptWorksHeader = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top'] },
})<ConceptWorksHeaderProps>`
  background-color: ${({ $hasWorksTabs, theme }) =>
    theme.color($hasWorksTabs ? 'warmNeutral.300' : 'white')};
`;

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
  totalResults: number | undefined;
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
  totalResults: number | undefined;
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
    totalResults: number | undefined;
  };
};
type PageSectionDefinitionProps<T> = {
  tabId: string;
  resultsGroup: ReturnedResults<T> | undefined;
  tabLabelText: string;
  totalResults: number | undefined;
  link: LinkProps;
};

function toPageSectionDefinition<T>({
  tabId,
  resultsGroup,
  tabLabelText,
  totalResults,
  link,
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

export type SectionData = {
  label: string;
  works: ReturnedResults<WorkBasic> | undefined;
  images: ReturnedResults<ImageType> | undefined;
  totalResults: { works: number | undefined; images: number | undefined };
};

export type ThemePageSectionsData = {
  about: SectionData;
  by: SectionData;
  in: SectionData;
};

type Props = {
  conceptResponse: ConceptType;
  sectionsData: ThemePageSectionsData;
  apiToolbarLinks: ApiToolbarLink[];
  pageview: Pageview;
};

export const ConceptPage: NextPage<Props> = ({
  conceptResponse,
  sectionsData,
  apiToolbarLinks,
}) => {
  const { newThemePages, themePagesAllFields } = useToggles();
  const [isMobileNavInverted, setIsMobileNavInverted] = useState(false);
  const { isEnhanced } = useAppContext();
  const mobileNavColorChangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
        setIsMobileNavInverted(true);
      } else if (entry.boundingClientRect.top >= 0) {
        setIsMobileNavInverted(false);
      }
    });
    if (!mobileNavColorChangeRef.current) return;
    observer.observe(mobileNavColorChangeRef.current);

    return () => observer.disconnect();
  }, [mobileNavColorChangeRef.current]);

  const pathname = usePathname();
  const worksTabs = tabOrder
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

  const imagesTabs: PageSectionDefinition<ImageType>[] = tabOrder
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
  const relatedConceptsGroupLabel = 'Related topics';
  const personOrAllFields =
    conceptResponse.type === 'Person' || themePagesAllFields;
  const buildNavLinks = () => {
    const links: Link[] = [];

    // Add image sections
    for (const section of tabOrder) {
      if (sectionsData[section].images?.totalResults) {
        const themeLabel = getThemeTabLabel(section, conceptResponse.type);
        links.push({
          text: `Images ${themeLabel}`,
          url: `#images-${themeLabel}`,
        });
      }
    }

    // Add works section
    links.push({ text: 'Works', url: '#works' });

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
      <ThemeHeader concept={conceptResponse} />
      {hasImages && <WobblyEdge backgroundColor="neutral.700" />}
      <Container>
        <Grid style={{ background: 'white', rowGap: 0 }}>
          <NavGridCell
            $isEnhanced={isEnhanced}
            $sizeMap={{ s: [12], m: [12], l: [3], xl: [2] }}
            $isMobileNavInverted={isMobileNavInverted}
          >
            <OnThisPageAnchors
              links={navLinks}
              isSticky={true}
              hasBackgroundBlend={true}
            />
          </NavGridCell>

          <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [10] }}>
            <StretchWrapper>
              <ThemeImages
                sectionsData={sectionsData}
                concept={conceptResponse}
              />
            </StretchWrapper>
            {/* This empty div is used in conjuction with an IntersectionObserver to
              determine when to change the colour of the mobile nav */}
            <div ref={mobileNavColorChangeRef}></div>
            <ThemeWorks concept={conceptResponse} sectionsData={sectionsData} />

            {(conceptResponse.type === 'Person' || themePagesAllFields) && (
              <>
                <Space
                  $v={{
                    size: 'xl',
                    properties: ['margin-top', 'margin-bottom'],
                  }}
                >
                  <ThemeCollaborators concepts={frequentCollaborators} />
                </Space>
                <Space
                  $v={{
                    size: 'xl',
                    properties: ['margin-top', 'margin-bottom'],
                  }}
                >
                  <ThemeRelatedConceptsGroup
                    label={relatedConceptsGroupLabel}
                    labelType="heading"
                    relatedConcepts={relatedTopics}
                    buttonColors={
                      themeValues.buttonColors.pumiceTransparentCharcoal
                    }
                  />
                </Space>
              </>
            )}
          </GridCell>
        </Grid>
      </Container>

      {
        // This is a placeholder for the Hotjar embedded survey to be injected
        // when the concept is a Person. It should be removed when the survey
        // is no longer used.
      }
      {conceptResponse.type === 'Person' && (
        <HotJarPlaceholder id="hotjar-embed-placeholder-concept-person" />
      )}
    </CataloguePageLayout>
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
        <HotJarPlaceholder id="hotjar-embed-placeholder-concept-person" />
      )}
    </CataloguePageLayout>
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

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
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
    props: serialiseProps({
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

export default ConceptPage;
