// @flow
import { type Context } from 'next';
import { type UiExhibition } from '@weco/common/model/exhibitions';
import { getExhibition } from '@weco/common/services/prismic/exhibitions';
import Exhibition from '../components/Exhibition/Exhibition';
import Installation from '../components/Installation/Installation';

type Props = {|
  exhibition: UiExhibition,
|};

const ExhibitionPage = ({ exhibition }: Props) => {
  if (exhibition.format && exhibition.format.title === 'Installation') {
    return <Installation installation={exhibition} />;
  } else {
    return <Exhibition exhibition={exhibition} />;
  }
};

ExhibitionPage.getInitialProps = async (ctx: Context) => {
  const { id, memoizedPrismic } = ctx.query;
  ctx.query.memoizedPrismic = undefined; // Once we've got memoizedPrismic, we need to remove it before making requests - otherwise we hit circular object issues with JSON.stringify
  const exhibition = await getExhibition(ctx.req, id, memoizedPrismic);

  if (exhibition) {
    return {
      exhibition,
    };
  } else {
    return { statusCode: 404 };
  }
};
export default ExhibitionPage;
