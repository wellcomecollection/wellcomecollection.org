import { NextPage } from 'next';

import { looksLikePrismicId } from '@weco/common/services/prismic';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import * as page from '@weco/content/pages/pages/[pageId]';

const CollectionsPage: NextPage<page.Props> = props => {
  return <page.Page {...props} />;
};

type Props = ServerSideProps<page.Props>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  const { uid } = context.query;

  const isHiddenPage = uid
    ? ['collections-landing', 'aKb_ahAAAB8AhtQC'].includes(
        Array.isArray(uid) ? uid[0] : uid
      )
    : false;

  if (isHiddenPage || !looksLikePrismicId(uid)) {
    return { notFound: true };
  }

  return page.getServerSideProps({
    ...context,
    query: { pageId: uid },
    params: { siteSection: 'collections' },
  });
};
export default CollectionsPage;
