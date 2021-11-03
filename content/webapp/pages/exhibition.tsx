import { UiExhibition } from '@weco/common/model/exhibitions';
import { Page } from '@weco/common/model/pages';
import { getExhibitionWithRelatedContent } from '@weco/common/services/prismic/exhibitions';
import Exhibition from '../components/Exhibition/Exhibition';
import Installation from '../components/Installation/Installation';
import {
  getGlobalContextData,
  WithGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import { AppErrorProps, WithGaDimensions } from '@weco/common/views/pages/_app';
import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';

type Props = {
  exhibition: UiExhibition;
  pages: Page[];
} & WithGlobalContextData &
  WithGaDimensions;

const ExhibitionPage: FC<Props> = ({
  exhibition,
  pages,
  globalContextData,
}) => {
  if (exhibition.format && exhibition.format.title === 'Installation') {
    return (
      <Installation
        installation={exhibition}
        globalContextData={globalContextData}
      />
    );
  } else {
    return (
      <Exhibition
        exhibition={exhibition}
        pages={pages}
        globalContextData={globalContextData}
      />
    );
  }
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = getServerData(context);
    const globalContextData = getGlobalContextData(context);
    const { id, memoizedPrismic } = context.query;
    const { exhibition, pages } = await getExhibitionWithRelatedContent({
      request: context.req,
      id,
      memoizedPrismic,
    });

    if (exhibition) {
      return {
        props: removeUndefinedProps({
          exhibition,
          pages: pages?.results || [],
          globalContextData,
          serverData,
          gaDimensions: {
            partOf: exhibition.seasons.map(season => season.id),
          },
        }),
      };
    } else {
      return { notFound: true };
    }
  };

export default ExhibitionPage;
