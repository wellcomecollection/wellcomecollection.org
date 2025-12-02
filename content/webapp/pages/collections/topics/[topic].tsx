import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { FunctionComponent, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { user as userIcon } from '@weco/common/icons';
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
import { topicDescriptions } from '@weco/content/data/browse/topics';
import { catalogueQuery } from '@weco/content/services/wellcome/catalogue';
import { getConceptsByIds } from '@weco/content/services/wellcome/catalogue/browse';
import {
  Concept,
  toWorkBasic,
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import RelatedWorksCard from '@weco/content/views/components/RelatedWorksCard';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';
import CollaboratorCard from '@weco/content/views/pages/concepts/concept/concept.Collaborators.Card';

const ContentSection = styled.div`
  background-color: ${props => props.theme.color('warmNeutral.300')};
  padding-top: ${props => props.theme.spacingUnit * 4}px;
`;

const SubTopicSection = styled.div<{ $index: number }>`
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

const SubTopicHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${props => props.theme.spacingUnit * 2}px;
`;

const SubTopicLink = styled(Link).attrs({
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
  --container-padding: ${props =>
    props.theme.formatContainerPadding(props.theme.containerPadding.small)};
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

const CollaboratorsWrapper = styled.div`
  margin-top: ${props => props.theme.spacingUnit * 3}px;
`;

const CollaboratorsTitle = styled.h3.attrs({
  className: font('brand', -1),
})`
  margin: 0 0 ${props => props.theme.spacingUnit * 2}px 0;
  color: ${props => props.theme.color('black')};
`;

const CollaboratorsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${props => props.theme.spacingUnit * 2}px;

  a {
    background-color: ${props => props.theme.color('white')};
  }
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
  concept: Concept;
  worksBySubTopic: Record<string, WorkBasic[]>;
  peopleBySubTopic: Record<string, Concept[]>;
};

const TopicDetailPage: FunctionComponent<Props> = ({
  concept,
  worksBySubTopic,
  peopleBySubTopic,
}) => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const allSubTopics = [
    ...(concept.relatedConcepts?.broaderThan || []),
    ...(concept.relatedConcepts?.relatedTopics || []),
  ];

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
  }, [allSubTopics.length]);

  return (
    <PageLayout
      title={`${concept.label} - Browse collections by topic`}
      description={topicDescriptions[concept.label]}
      url={{ pathname: `/collections/topics/${concept.id}` }}
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
              text: 'Browse by topic',
              url: '/collections/topics',
            },
            {
              text: concept.label,
              url: `/collections/topics/${concept.id}`,
              isHidden: true,
            },
          ],
        }}
        labels={{ labels: [] }}
        title={
          <ConceptLink href={`/concepts/${concept.id}`}>
            {concept.label}
          </ConceptLink>
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
            <IntroText>{topicDescriptions[concept.label]}</IntroText>
            <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
              {allSubTopics.map((subTopic, index) => {
                const works = worksBySubTopic[subTopic.id] || [];

                console.log(
                  `Subtopic: ${subTopic.label}, Works found: ${works.length}`
                );
                // Show subtopic even if no works for debugging
                // if (works.length === 0) return null;

                return (
                  <SubTopicSection
                    key={subTopic.id}
                    $index={index}
                    ref={el => {
                      sectionRefs.current[index] = el;
                    }}
                  >
                    <SubTopicHeader>
                      <SubTopicLink href={`/concepts/${subTopic.id}`}>
                        {subTopic.label}
                      </SubTopicLink>
                    </SubTopicHeader>

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

                    {peopleBySubTopic[subTopic.id] &&
                      peopleBySubTopic[subTopic.id].length > 0 && (
                        <CollaboratorsWrapper>
                          <CollaboratorsTitle>
                            Notable people
                          </CollaboratorsTitle>
                          <CollaboratorsList>
                            {peopleBySubTopic[subTopic.id].map(person => (
                              <CollaboratorCard
                                key={person.id}
                                href={`/concepts/${person.id}`}
                                label={person.label}
                                icon={userIcon}
                              />
                            ))}
                          </CollaboratorsList>
                        </CollaboratorsWrapper>
                      )}

                    <Space $v={{ size: 'xl', properties: ['margin-top'] }} />
                  </SubTopicSection>
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

  const { topic: topicSlug } = context.params as { topic: string };

  try {
    console.log('Fetching concept with ID:', topicSlug);

    // Fetch concept by ID (the topicSlug is actually the concept ID)
    const concepts = await getConceptsByIds([topicSlug]);

    const concept = concepts[0];

    if (!concept) {
      console.log('Concept not found, returning 404');
      return {
        notFound: true,
      };
    }

    const worksBySubTopic: Record<string, WorkBasic[]> = {};
    const peopleBySubTopic: Record<string, Concept[]> = {};

    // Get works for each broader concept (subtopic) and related topics
    const allSubTopics = [
      ...(concept.relatedConcepts?.broaderThan || []),
      ...(concept.relatedConcepts?.relatedTopics || []),
    ];

    if (allSubTopics.length > 0) {
      // Fetch full concept data for each subtopic
      const subTopicIds = allSubTopics.map(subTopic => subTopic.id);
      const fullSubTopicConcepts = await getConceptsByIds(subTopicIds);

      // Collect all people concept IDs from the subtopics
      const allPeopleIds = new Set<string>();
      fullSubTopicConcepts.forEach(concept => {
        // Add people from the people field
        concept.relatedConcepts?.people?.forEach(person =>
          allPeopleIds.add(person.id)
        );
        // Add Person-type concepts from relatedTo field
        concept.relatedConcepts?.relatedTo?.forEach(related => {
          if (related.conceptType === 'Person') {
            allPeopleIds.add(related.id);
          }
        });
        // Add people from frequentCollaborators field
        concept.relatedConcepts?.frequentCollaborators?.forEach(collaborator =>
          allPeopleIds.add(collaborator.id)
        );
      });

      // Fetch all the people concepts
      const peopleConceptIds = Array.from(allPeopleIds);
      const peopleConcepts =
        peopleConceptIds.length > 0
          ? await getConceptsByIds(peopleConceptIds)
          : [];

      // Create a map of concept ID to full concept data (subtopics + people)
      const conceptsById = [...fullSubTopicConcepts, ...peopleConcepts].reduce(
        (acc, concept) => {
          acc[concept.id] = concept;
          return acc;
        },
        {} as Record<string, Concept>
      );

      await Promise.all(
        allSubTopics.map(async subTopic => {
          try {
            console.log(
              `Fetching works for subtopic: ${subTopic.label} (ID: ${subTopic.id})`
            );

            const worksResult = await catalogueQuery('works', {
              toggles: {},
              pageSize: 10,
              params: {
                query: subTopic.label,
                include: ['production', 'contributors'],
              },
            });

            if ('type' in worksResult && worksResult.type === 'Error') {
              console.error(
                `Failed to fetch works for subtopic ${subTopic.id}:`,
                worksResult
              );
              worksBySubTopic[subTopic.id] = [];
            } else {
              const works = worksResult.results || [];
              console.log(
                `Found ${works.length} works for subtopic: ${subTopic.label}`
              );
              // Transform Work objects to WorkBasic
              const workBasics = works
                .filter((work): work is Work => 'title' in work) // Filter out concepts if any
                .map(work => toWorkBasic(work));
              worksBySubTopic[subTopic.id] = workBasics;
            }

            // Get people (Person concepts) related to this subtopic
            const fullConcept = conceptsById[subTopic.id];
            const allPeopleRefs = [
              ...(fullConcept?.relatedConcepts?.people || []),
              ...(fullConcept?.relatedConcepts?.relatedTo?.filter(
                concept => concept.conceptType === 'Person'
              ) || []),
              ...(fullConcept?.relatedConcepts?.frequentCollaborators || []),
            ];

            if (allPeopleRefs.length > 0) {
              // Remove duplicates by ID
              const uniquePeopleRefs = allPeopleRefs.filter(
                (person, index, array) =>
                  array.findIndex(p => p.id === person.id) === index
              );

              peopleBySubTopic[subTopic.id] = uniquePeopleRefs
                .map(personRef => conceptsById[personRef.id])
                .filter(Boolean); // Remove any undefined concepts
            } else {
              peopleBySubTopic[subTopic.id] = [];
            }
          } catch (error) {
            console.error(
              `Error fetching works for subtopic ${subTopic.id}:`,
              error
            );
            worksBySubTopic[subTopic.id] = [];
            peopleBySubTopic[subTopic.id] = [];
          }
        })
      );
    }

    return {
      props: serialiseProps({
        concept,
        worksBySubTopic,
        peopleBySubTopic,
        serverData,
      }),
    };
  } catch (error) {
    return appError(
      context,
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

const Page: NextPage<ServerSideProps<Props> | AppErrorProps> = props => {
  if ('statusCode' in props) {
    return null;
  }

  const { concept, worksBySubTopic, peopleBySubTopic } =
    props as ServerSideProps<Props>;
  return (
    <TopicDetailPage
      concept={concept}
      worksBySubTopic={worksBySubTopic}
      peopleBySubTopic={peopleBySubTopic}
    />
  );
};

export default Page;
