// @flow
import { type Context } from 'next';
import { type UiExhibition } from '@weco/common/model/exhibitions';
import {
  getExhibition,
  getExhibitExhibition,
} from '@weco/common/services/prismic/exhibitions';
import Exhibition from '../components/Exhibition/Exhibition';
import Installation from '../components/Installation/Installation';

type Props = {|
  exhibition: UiExhibition,
  partOf: ?UiExhibition,
|};

const ExhibitionPage = ({ exhibition, partOf }: Props) => {
  if (exhibition.format && exhibition.format.title === 'Installation') {
    return <Installation installation={exhibition} partOf={partOf} />;
  } else {
    return <Exhibition exhibition={exhibition} />;
  }
};

ExhibitionPage.getInitialProps = async (ctx: Context) => {
  const { id } = ctx.query;

  const [exhibition, partOf] = await Promise.all([
    getExhibition(ctx.req, id),
    getExhibitExhibition(ctx.req, id),
  ]);

  if (exhibition) {
    return {
      exhibition,
      partOf,
    };
  } else {
    return { statusCode: 404 };
  }
};
export default ExhibitionPage;
