// @flow
import { type Context } from 'next';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
type Props = {|
  workId: string,
  id: string,
|};

const ItemPage = ({ workId, id }: Props) => (
  <PageLayout
    title={''}
    description={''}
    url={{ pathname: `/works/${workId}/items/${id}` }}
    openGraphType={'website'}
    jsonLd={{ '@type': 'WebPage' }}
    siteSection={'works'}
    imageUrl={'imageContentUrl'}
    imageAltText={''}
    hideNewsletterPromo={true}
  >
    <h1>{id}</h1>
  </PageLayout>
);

ItemPage.getInitialProps = async (ctx: Context): Promise<Props> => {
  const { id, workId } = ctx.query;
  return { id, workId };
};

export default ItemPage;
