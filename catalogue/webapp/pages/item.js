// @flow
import { type Context } from 'next';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
type Props = {|
  workId: string,
|};

const ItemPage = ({ workId }: Props) => (
  <PageLayout
    title={''}
    description={''}
    url={{ pathname: `/works/${workId}/items` }}
    openGraphType={'website'}
    jsonLd={{ '@type': 'WebPage' }}
    siteSection={'works'}
    imageUrl={'imageContentUrl'}
    imageAltText={''}
    hideNewsletterPromo={true}
  >
    <h1>{workId}</h1>
  </PageLayout>
);

ItemPage.getInitialProps = async (ctx: Context): Promise<Props> => {
  const { workId } = ctx.query;
  return { workId };
};

export default ItemPage;
