// @flow
import {getExhibition} from '@weco/common/services/prismic/exhibitions';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import type {UiExhibition} from '@weco/common/model/exhibitions';

type Props = {|
  exhibition: UiExhibition
|}

export const ExhibitionPage = ({
  exhibition
}: Props) => (
  <div>
    <h1 className='h1'>{exhibition.title}</h1>
    <pre style={{
      width: '100%',
      overflow: 'auto'
    }}>
      {JSON.stringify(exhibition, null, 2)}
    </pre>
  </div>
);

ExhibitionPage.getInitialProps = async ({req, query}) => {
  // TODO: We shouldn't need this, but do for flow as
  // `GetInitialPropsClientProps` doesn't have `req`
  if (req) {
    const {id} = query;
    const exhibition = await getExhibition(req, id);

    return {
      exhibition
    };
  }
};

export default PageWrapper(ExhibitionPage);
