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
import PageLayout from '@weco/common/views/layouts/PageLayout';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { BrowseType, types } from '@weco/content/data/browse/types';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import TabsNavigate, {
  NavigateSelectableTextLink,
} from '@weco/content/views/components/Tabs/Tabs.Navigate';
import BrowseTypesGrid from '@weco/content/views/pages/collections/types/types.BrowseTypesGrid';

type Props = {
  types: BrowseType[];
};

const BrowseTypesPage: FunctionComponent<Props> = ({ types }) => {
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
      title="Browse the collections by type"
      description="Explore our collections organised by type of material"
      url={{ pathname: '/collections/types' }}
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
              text: 'Browse by type',
              url: '/collections/types',
              isHidden: true,
            },
          ],
        }}
        labels={{ labels: [] }}
        title="Browse the collections"
        ContentTypeInfo={null}
        Background={undefined}
        FeaturedMedia={undefined}
        HeroPicture={undefined}
        highlightHeading={true}
        backgroundTexture={headerBackgroundLs}
      />

      <ContaineredLayout gridSizes={gridSize12()}>
        <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
          <TabsNavigate
            items={tabs}
            currentSection="types"
            label="Browse collections by type or topic"
          />
          <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
            <BrowseTypesGrid types={types} />
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

  // Return 404 if the browseCollections toggle is not enabled
  if (!serverData.toggles.browseCollections) {
    return {
      notFound: true,
    };
  }

  try {
    return {
      props: serialiseProps({
        types,
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

const Page: NextPage<Props | AppErrorProps> = props => {
  if ('statusCode' in props) {
    return null;
  }

  return <BrowseTypesPage {...(props as Props)} />;
};

export default Page;
