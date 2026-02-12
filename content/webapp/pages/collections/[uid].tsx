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
    collectionsLanding: ['collections', 'aKb_ahAAAB8AhtQC'],
    places: ['thematic-browsing-places', 'aYYbgBIAACUA8_PS'],
    peopleAndOrganisations: ['thematic-browsing-people', 'aYYhzRIAACQA8_2V'],
    typesAndTechniques: ['thematic-browsing-types', 'aYYiGRIAACQA8_4N'],
    subjects: ['thematic-browsing-subjects', 'aYYi7RIAACUA8_9m'],
    militaryAndWar: ['subjects-military-and-war', 'aXNKABEAACAAypp_'],
    medicineCareAndTreatment: [
      'subjects-medicine-care-and-treatment',
      'aY2jMBAAACEAHkc6',
    ],
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
