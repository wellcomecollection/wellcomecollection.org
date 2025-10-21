import { NextPage } from 'next';
import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import Tabs, { Tab } from '@weco/common/views/components/Tabs';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { BrowseType, types } from '@weco/content/data/browse/types';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import BrowseTypesGrid from '@weco/content/views/pages/collections/types/types.BrowseTypesGrid';

type Props = {
  types: BrowseType[];
};

const BrowseTypesPage: FunctionComponent<Props> = ({ types }) => {
  const tabs: Tab[] = [
    {
      label: 'By type',
      href: '/collections/types',
      isActive: true,
    },
    {
      label: 'By topic',
      href: '/collections/topics',
      isActive: false,
    },
  ];

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
              text: 'Browse by type',
              url: '/collections/types',
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
      />

      <ContaineredLayout gridSizes={gridSize12()}>
        <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
          <Tabs tabs={tabs} ariaLabel="Browse collections by type or topic">
            <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
              <BrowseTypesGrid types={types} />
            </Space>
          </Tabs>
        </Space>
      </ContaineredLayout>
    </>
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
        types,
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

  return <BrowseTypesPage {...props} />;
};

export default Page;
