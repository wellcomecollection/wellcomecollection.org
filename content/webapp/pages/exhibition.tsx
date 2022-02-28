import { Page as PageType } from '../types/pages';
import Exhibition from '../components/Exhibition/Exhibition';
import { Exhibition as ExhibitionType} from '../types/exhibitions';
import Installation from '../components/Installation/Installation';
import { AppErrorProps, WithGaDimensions } from '@weco/common/views/pages/_app';
import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { createClient } from '../services/prismic/fetch';
import { fetchExhibition } from 'services/prismic/fetch/exhibitions';
import { transformQuery } from 'services/prismic/transformers/paginated-results';
import { transformPage } from 'services/prismic/transformers/pages';
import { transformExhibition } from 'services/prismic/transformers/exhibitions';
import { looksLikePrismicId } from '../services/prismic';

type Props = {
  exhibition: ExhibitionType;
  pages: PageType[];
} & WithGaDimensions;

const ExhibitionPage: FC<Props> = ({ exhibition, pages }) => {
  if (exhibition.format && exhibition.format.title === 'Installation') {
    return <Installation installation={exhibition} />;
  } else {
    return <Exhibition exhibition={exhibition} pages={pages} />;
  }
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { id } = context.query;

    if (!looksLikePrismicId(id)) {
      return { notFound: true };
    }

    const client = createClient(context);
    const { exhibition, pages } = await fetchExhibition(client, id as string);

    if (exhibition) {
      const exhibitionDoc = transformExhibition(exhibition);
      const relatedPages = transformQuery(pages, transformPage);

      return {
        props: removeUndefinedProps({
          // TODO: This is a temporary shim until we can get rid of the UiExhibition
          // type.  Ideally we'd pass the exhibitionDoc directly here.
          exhibition: {
            ...exhibitionDoc,
            featuredImageList: [],
          },
          pages: relatedPages?.results || [],
          serverData,
          gaDimensions: {
            partOf: exhibitionDoc.seasons.map(season => season.id),
          },
        }),
      };
    } else {
      return { notFound: true };
    }
  };

export default ExhibitionPage;
