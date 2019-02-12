// @flow
import { type Context } from 'next';
import { type UiExhibition } from '@weco/common/model/exhibitions';
import { getExhibition } from '@weco/common/services/prismic/exhibitions';
import Exhibition from '../components/Exhibition/Exhibition';

type Props = {|
  exhibition: UiExhibition,
|};

const ExhibitionPage = ({ exhibition }: Props) => {
  return <Exhibition exhibition={exhibition} />;
};

ExhibitionPage.getInitialProps = async (ctx: Context) => {
  const { id } = ctx.query;
  const exhibition = await getExhibition(ctx.req, id);

  if (exhibition) {
    return {
      exhibition,
    };
  } else {
    return { statusCode: 404 };
  }
};
export default ExhibitionPage;
