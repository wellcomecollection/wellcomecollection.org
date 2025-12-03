import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { FunctionComponent, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { font } from '@weco/common/utils/classnames';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { ServerSideProps } from '@weco/common/views/pages/_app';
import { BrowseType, types } from '@weco/content/data/browse/types';
import { getWorksForSubType } from '@weco/content/data/browse/works';
import {
  fetchConceptIdByLabel,
  fetchTopGenresForWorkType,
  fetchWorksByTypeAndGenre,
} from '@weco/content/services/wellcome/catalogue/browse';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import RelatedWorksCard from '@weco/content/views/components/RelatedWorksCard';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';

const ContentSection = styled.div`
  background-color: ${props => props.theme.color('warmNeutral.300')};
  padding-top: ${props => props.theme.spacingUnit * 4}px;
`;

const SubTypeSection = styled.div<{ $index: number }>`
  opacity: 0;
  transform: translateX(
    ${props => (props.$index % 2 === 0 ? '-50px' : '50px')}
  );
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;

  &.visible {
    opacity: 1;
    transform: translateX(0);
  }
`;

const SubTypeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${props => props.theme.spacingUnit * 2}px;
`;

const SubTypeTitle = styled.h2.attrs({
  className: font('brand', 1),
})`
  margin: 0;
`;

const SubTypeLink = styled(Link).attrs({
  className: font('brand', 1),
})`
  margin: 0;
  text-decoration: underline;
  color: ${props => props.theme.color('black')};

  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

const WorkItem = styled.li`
  --container-padding: ${props => props.theme.containerPadding};
  flex: 0 0 90%;
  max-width: 420px;

  padding-left: var(--container-padding);

  &:last-child {
    padding-right: var(--container-padding);
  }

  ${props =>
    props.theme.media('medium')(`
      flex: 0 0 50%;
      padding: 0 var(--container-padding) 0 0;
    `)}
`;

const IntroText = styled.p.attrs({
  className: font('sans', 0),
})`
  margin: 0 0 ${props => props.theme.spacingUnit * 4}px 0;
  max-width: 60ch;
`;

const ConceptLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.color('black')};

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

type Props = {
  type: BrowseType;
  worksBySubType: Record<string, WorkBasic[]>;
};

const TypeDetailPage: FunctionComponent<Props> = ({ type, worksBySubType }) => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    sectionRefs.current.forEach(section => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [type.subTypes]);

  return (
    <PageLayout
      title={`${type.label} - Browse collections by type`}
      description={type.description}
      url={{ pathname: `/collections/types/${type.slug}` }}
      jsonLd={[]}
      openGraphType="website"
      siteSection="collections"
      hideNewsletterPromo
      isNoIndex
    >
      <PageHeader
        variant="basic"
        breadcrumbs={{
          items: [
            {
              text: 'Collections',
              url: '/collections',
            },
            {
              text: 'Browse by type',
              url: '/collections/types',
            },
            {
              text: type.label,
              url: `/collections/types/${type.slug}`,
              isHidden: true,
            },
          ],
        }}
        labels={{ labels: [] }}
        title={
          type.conceptId ? (
            <ConceptLink href={`/concepts/${type.conceptId}`}>
              {type.label}
            </ConceptLink>
          ) : (
            type.label
          )
        }
        ContentTypeInfo={null}
        Background={undefined}
        FeaturedMedia={undefined}
        HeroPicture={undefined}
        highlightHeading={true}
      />

      <ContentSection>
        <ContaineredLayout gridSizes={gridSize12()}>
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            <IntroText>{type.description}</IntroText>

            <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
              {type.subTypes.map((subType, index) => {
                const works = worksBySubType[subType.id] || [];

                if (works.length === 0) return null;

                return (
                  <SubTypeSection
                    key={subType.id}
                    $index={index}
                    ref={el => {
                      sectionRefs.current[index] = el;
                    }}
                  >
                    <SubTypeHeader>
                      {subType.conceptId ? (
                        <SubTypeLink href={`/concepts/${subType.conceptId}`}>
                          {subType.label}
                        </SubTypeLink>
                      ) : (
                        <SubTypeTitle>{subType.label}</SubTypeTitle>
                      )}
                    </SubTypeHeader>

                    <ScrollContainer
                      scrollButtonsAfter={true}
                      gridSizes={gridSize12()}
                    >
                      {works.map(work => (
                        <WorkItem key={work.id}>
                          <RelatedWorksCard work={work} variant="default" />
                        </WorkItem>
                      ))}
                    </ScrollContainer>

                    <Space $v={{ size: 'xl', properties: ['margin-top'] }} />
                  </SubTypeSection>
                );
              })}
            </Space>
          </Space>
        </ContaineredLayout>
      </ContentSection>
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  ServerSideProps<Props> | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  // Return 404 if the browseCollections toggle is not enabled
  if (!serverData.toggles.browseCollections) {
    return {
      notFound: true,
    };
  }

  const { type: typeSlug } = context.params as { type: string };

  try {
    const type = types.find(t => t.slug === typeSlug);

    if (!type) {
      return {
        notFound: true,
      };
    }

    console.log(
      `[Browse Types] Loading page for: ${type.label} (workType: ${type.workType})`
    );

    const worksBySubType: Record<string, WorkBasic[]> = {};
    let typeToRender: BrowseType = type;

    try {
      // Try to fetch real data from API
      console.log(
        `[Browse Types] Fetching top genres for workType: ${type.workType}`
      );
      const [topGenres, typeConceptId] = await Promise.all([
        fetchTopGenresForWorkType(type.workType, serverData.toggles),
        fetchConceptIdByLabel(type.label, serverData.toggles),
      ]);

      console.log(`[Browse Types] Fetched ${topGenres.length} genres`);

      if (topGenres.length > 0) {
        // Fetch works and concept IDs for each genre
        console.log(`[Browse Types] Fetching works for each genre...`);
        await Promise.all(
          topGenres.map(async genre => {
            const [works, conceptId] = await Promise.all([
              fetchWorksByTypeAndGenre(
                type.workType,
                genre.label,
                10,
                serverData.toggles
              ),
              fetchConceptIdByLabel(genre.label, serverData.toggles),
            ]);
            worksBySubType[genre.id] = works;
            genre.conceptId = conceptId;
            console.log(
              `[Browse Types] Fetched ${works.length} works for genre: ${genre.label}${conceptId ? ` (concept: ${conceptId})` : ''}`
            );
          })
        );

        // Update type with real genres data
        typeToRender = {
          ...type,
          conceptId: typeConceptId,
          subTypes: topGenres.map(genre => ({
            id: genre.id,
            label: genre.label,
            workCount: genre.count,
            conceptId: genre.conceptId,
          })),
        };

        console.log(`[Browse Types] Successfully loaded real data`);
      } else {
        console.warn(
          `[Browse Types] No genres found, falling back to dummy data`
        );
        throw new Error('No genres found');
      }
    } catch (apiError) {
      // Fall back to dummy data if API fails
      console.warn(`[Browse Types] API error, using dummy data:`, apiError);

      type.subTypes.forEach(subType => {
        worksBySubType[subType.id] = getWorksForSubType(subType.id);
      });
    }

    return {
      props: serialiseProps({
        type: typeToRender,
        worksBySubType,
        serverData,
      }),
    };
  } catch (error) {
    console.error('Error in type detail page getServerSideProps:', error);
    return appError(
      context,
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

const Page: NextPage<Props | AppErrorProps> = props => {
  if ('statusCode' in props) {
    return null;
  }

  return <TypeDetailPage {...(props as Props)} />;
};

export default Page;
