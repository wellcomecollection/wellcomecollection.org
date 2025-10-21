import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { personSolid } from '@weco/common/icons';
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
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import {
  BrowseTopic,
  SubTopic,
  topics,
} from '@weco/content/data/browse/topics';
import { getWorksForSubType } from '@weco/content/data/browse/works';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import FeaturedWorkCard from '@weco/content/views/components/FeaturedWorkCard';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';
import CollaboratorCard from '@weco/content/views/pages/concepts/concept/concept.Collaborators.Card';

const SubTopicSection = styled.div``;

const SubTopicHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${props => props.theme.spacingUnit * 2}px;
`;

const SubTopicTitle = styled.h2.attrs({
  className: font('wb', 3),
})`
  margin: 0;
`;

const WorksList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: ${props => props.theme.spacingUnit * 3}px;
`;

const WorkItem = styled.li`
  flex-shrink: 0;
`;

const CollaboratorsWrapper = styled.div`
  margin-top: ${props => props.theme.spacingUnit * 3}px;
`;

const CollaboratorsTitle = styled.h3.attrs({
  className: font('wb', 5),
})`
  margin: 0 0 ${props => props.theme.spacingUnit * 2}px 0;
`;

const CollaboratorsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${props => props.theme.spacingUnit * 2}px;

  ${props => props.theme.media('medium')`
    grid-template-columns: repeat(3, 1fr);
  `}
`;

const IntroText = styled.p.attrs({
  className: font('intr', 4),
})`
  margin: 0 0 ${props => props.theme.spacingUnit * 4}px 0;
  max-width: 60ch;
`;

const ConceptLink = styled(Link).attrs({
  className: font('wb', 1),
})`
  text-decoration: none;
  color: ${props => props.theme.color('black')};

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

type Props = {
  topic: BrowseTopic;
  worksBySubTopic: Record<string, WorkBasic[]>;
};

const TopicDetailPage: FunctionComponent<Props> = ({
  topic,
  worksBySubTopic,
}) => {
  return (
    <>
      <PageHeader
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
              text: topic.label,
              url: `/collections/topics/${topic.slug}`,
              isHidden: true,
            },
          ],
        }}
        labels={{ labels: [] }}
        title={
          <ConceptLink href={`/concepts/${topic.conceptId}`}>
            {topic.label}
          </ConceptLink>
        }
        ContentTypeInfo={null}
        Background={null}
        FeaturedMedia={null}
        HeroPicture={null}
        highlightHeading={true}
      />

      <ContaineredLayout gridSizes={gridSize12()}>
        <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
          <IntroText>{topic.description}</IntroText>

          <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
            {topic.subTopics.map(subTopic => {
              const works = worksBySubTopic[subTopic.id] || [];

              if (works.length === 0) return null;

              return (
                <SubTopicSection key={subTopic.id}>
                  <SubTopicHeader>
                    <SubTopicTitle>{subTopic.label}</SubTopicTitle>
                  </SubTopicHeader>

                  <ScrollContainer
                    scrollButtonsAfter={true}
                    gridSizes={gridSize12()}
                  >
                    <WorksList>
                      {works.map(work => (
                        <WorkItem key={work.id}>
                          <FeaturedWorkCard work={work} />
                        </WorkItem>
                      ))}
                    </WorksList>
                  </ScrollContainer>

                  {subTopic.collaborators &&
                    subTopic.collaborators.length > 0 && (
                      <CollaboratorsWrapper>
                        <CollaboratorsTitle>Notable people</CollaboratorsTitle>
                        <CollaboratorsList>
                          {subTopic.collaborators.map(collaborator => (
                            <CollaboratorCard
                              key={collaborator.id}
                              href={`/concepts/${collaborator.conceptId}`}
                              label={collaborator.label}
                              icon={personSolid}
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
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  ServerSideProps<Props> | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  const { topic: topicSlug } = context.params as { topic: string };

  try {
    const topic = topics.find(t => t.slug === topicSlug);

    if (!topic) {
      return {
        notFound: true,
      };
    }

    const worksBySubTopic: Record<string, WorkBasic[]> = {};

    topic.subTopics.forEach(subTopic => {
      worksBySubTopic[subTopic.id] = getWorksForSubType(subTopic.id);
    });

    return {
      props: serialiseProps({
        topic,
        worksBySubTopic,
        serverData,
      }),
    };
  } catch (error) {
    return appError(context, 500, error instanceof Error ? error : undefined);
  }
};

const Page: NextPage<Props | AppErrorProps> = props => {
  if ('statusCode' in props) {
    return null;
  }

  return <TopicDetailPage {...props} />;
};

export default Page;
