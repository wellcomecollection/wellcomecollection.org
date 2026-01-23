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

  // These are pages that are not to be found via the /collections/[uid] route
  // but have their own dedicated routes
  // TODO add core subjects page when officialised and implemented
  const collectionsHiddenPages = {
    collectionsLanding: ['collections-landing', 'aKb_ahAAAB8AhtQC'],
    militaryAndWar: ['subjects-military-and-war', 'aXNKABEAACAAypp_'],
  };
  const flattenedHiddenPages = Object.values(collectionsHiddenPages).flat();

  const isHiddenPage = uid
    ? flattenedHiddenPages.includes(Array.isArray(uid) ? uid[0] : uid)
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
