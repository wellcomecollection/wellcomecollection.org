// @flow
import { type Context } from 'next';
import { type UiExhibition } from '@weco/common/model/exhibitions';
import { type Page } from '@weco/common/model/pages';
import { getExhibitionWithRelatedContent } from '@weco/common/services/prismic/exhibitions';
import Exhibition from '../components/Exhibition/Exhibition';
import Installation from '../components/Installation/Installation';

type Props = {|
  exhibition: UiExhibition,
  pages: Page[],
|};

const ExhibitionPage = ({ exhibition, pages }: Props) => {
  if (exhibition.format && exhibition.format.title === 'Installation') {
    return <Installation installation={exhibition} />;
  } else {
    return <Exhibition exhibition={exhibition} pages={pages} />;
  }
};

ExhibitionPage.getInitialProps = async (ctx: Context) => {
  const { id, memoizedPrismic } = ctx.query;
  const { exhibition, pages } = await getExhibitionWithRelatedContent({
    request: ctx.req,
    id,
    memoizedPrismic,
  });

  if (exhibition) {
    return {
      exhibition,
      pages: pages?.results || [],
    };
  } else {
    return { statusCode: 404 };
  }
};
export default ExhibitionPage;
