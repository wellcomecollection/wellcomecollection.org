// @flow
import { type Context } from 'next';
import { type UiExhibition } from '@weco/common/model/exhibitions';
import { type Page } from '@weco/common/model/pages';
import { getExhibitionWithRelatedContent } from '@weco/common/services/prismic/exhibitions';
import Exhibition from '../components/Exhibition/Exhibition';
import Installation from '../components/Installation/Installation';
// $FlowFixMe
import { getGlobalContextData } from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';

type Props = {|
  exhibition: UiExhibition,
  pages: Page[],
  globalContextData: any,
|};

const ExhibitionPage = ({ exhibition, pages, globalContextData }: Props) => {
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

ExhibitionPage.getInitialProps = async (ctx: Context) => {
  const globalContextData = getGlobalContextData(ctx);
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
      globalContextData,
    };
  } else {
    return { statusCode: 404 };
  }
};
export default ExhibitionPage;
