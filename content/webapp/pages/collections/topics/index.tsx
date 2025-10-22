import { NextPage } from 'next';
import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import WShape from '@weco/common/views/components/WShape';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { BrowseTopic, topics } from '@weco/content/data/browse/topics';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import TabsNavigate, {
  NavigateSelectableTextLink,
} from '@weco/content/views/components/Tabs/Tabs.Navigate';
import BrowseTopicsGrid from '@weco/content/views/pages/collections/topics/topics.BrowseTopicsGrid';

type Props = {
  topics: BrowseTopic[];
};

const BrowseTopicsPage: FunctionComponent<Props> = ({ topics }) => {
  const tabs: NavigateSelectableTextLink[] = [
    {
      id: 'types',
      text: 'By type',
      url: '/collections/types',
    },
    {
      id: 'topics',
      text: 'By topic',
      url: '/collections/topics',
    },
  ];

  return (
    <PageLayout
      title="Browse the collections by topic"
      description="Explore our collections organised by topic"
      url={{ pathname: '/collections/topics' }}
      jsonLd={[]}
      openGraphType="website"
      siteSection="collections"
      hideNewsletterPromo
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
              isHidden: true,
            },
          ],
        }}
        labels={{ labels: [] }}
        title="Browse the collections"
        ContentTypeInfo={null}
        Background={null}
        FeaturedMedia={null}
        HeroPicture={null}
        highlightHeading={true}
        backgroundTexture={headerBackgroundLs}
      />

      <div
        style={{
          position: 'absolute',
          inset: '27% 1% 0',
          zIndex: -1,
          overflow: 'hidden',
          transform: 'scaleX(-1)',
        }}
      >
        <WShape color="accent.lightGreen" variant="full-1" />
      </div>

      <ContaineredLayout gridSizes={gridSize12()}>
        <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
          <TabsNavigate
            items={tabs}
            currentSection="topics"
            label="Browse collections by type or topic"
          />
          <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
            <BrowseTopicsGrid topics={topics} />
          </Space>
        </Space>
      </ContaineredLayout>
    </PageLayout>
  );
};

export const getServerSideProps: ServerSidePropsOrAppError<
  ServerSideProps<Props>
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  try {
    return {
      props: serialiseProps({
        topics,
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

  return <BrowseTopicsPage {...props} />;
};

export default Page;
