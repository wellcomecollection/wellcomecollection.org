import { NextPage } from 'next';

import { looksLikePrismicId } from '@weco/common/services/prismic';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import * as page from '@weco/content/pages/pages/[pageId]';

const Page: NextPage<page.Props> = props => {
  return <page.Page {...props} />;
};

type Props = ServerSideProps<page.Props>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  const { uid } = context.query;

  // a11y prototype page, should be accessed via its actual uid.
  if (!looksLikePrismicId(uid) || uid === 'aR3wwBAAACYAZt2l') {
    return { notFound: true };
  }

  return page.getServerSideProps({
    ...context,
    query: { pageId: uid },
    params: { siteSection: 'visit-us' },
  });
};

export default Page;
