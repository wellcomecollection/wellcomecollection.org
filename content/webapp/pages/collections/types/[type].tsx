import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { FunctionComponent } from 'react';
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
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { BrowseType, types } from '@weco/content/data/browse/types';
import { getWorksForSubType } from '@weco/content/data/browse/works';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import FeaturedWorkCard from '@weco/content/views/components/FeaturedWorkCard';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';

const SubTypeSection = styled.div``;

const SubTypeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${props => props.theme.spacingUnit * 2}px;
`;

const SubTypeTitle = styled.h2.attrs({
  className: font('wb', 3),
})`
  margin: 0;
`;

const SubTypeLink = styled(Link).attrs({
  className: font('wb', 3),
})`
  margin: 0;
  text-decoration: none;
  color: ${props => props.theme.color('black')};

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

const WorkItem = styled.li`
  flex-shrink: 0;
  margin-right: ${props => props.theme.spacingUnit * 3}px;

  &:last-child {
    margin-right: 0;
  }
`;

const TypeTitle = styled.h1.attrs({
  className: font('wb', 1),
})`
  margin: 0 0 ${props => props.theme.spacingUnit * 2}px 0;
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
  type: BrowseType;
  worksBySubType: Record<string, WorkBasic[]>;
};

const TypeDetailPage: FunctionComponent<Props> = ({ type, worksBySubType }) => {
  return (
    <PageLayout
      title={`${type.label} - Browse collections by type`}
      description={type.description}
      url={{ pathname: `/collections/types/${type.slug}` }}
      jsonLd={[]}
      openGraphType="website"
      siteSection="collections"
      hideNewsletterPromo
    >
      <PageHeader
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
        Background={null}
        FeaturedMedia={null}
        HeroPicture={null}
        highlightHeading={true}
      />

      <ContaineredLayout gridSizes={gridSize12()}>
        <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
          <TypeTitle>{type.label}</TypeTitle>
          <IntroText>{type.description}</IntroText>

          <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
            {type.subTypes.map(subType => {
              const works = worksBySubType[subType.id] || [];

              if (works.length === 0) return null;

              return (
                <SubTypeSection key={subType.id}>
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
                        <FeaturedWorkCard work={work} />
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
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  ServerSideProps<Props> | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  const { type: typeSlug } = context.params as { type: string };

  try {
    const type = types.find(t => t.slug === typeSlug);

    if (!type) {
      return {
        notFound: true,
      };
    }

    const worksBySubType: Record<string, WorkBasic[]> = {};

    type.subTypes.forEach(subType => {
      worksBySubType[subType.id] = getWorksForSubType(subType.id);
    });

    return {
      props: serialiseProps({
        type,
        worksBySubType,
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

  return <TypeDetailPage {...props} />;
};

export default Page;
