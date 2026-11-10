import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { getArchiveCategories } from '@weco/content/server-data/archiveCategories';
import { looksLikeCanonicalId } from '@weco/content/services/wellcome/catalogue';
import { getWork } from '@weco/content/services/wellcome/catalogue/works';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import WorkPage, {
  Props as WorkPageProps,
} from '@weco/content/views/pages/works/work';
import { phaseIsAtLeast } from '@weco/toggles';

const Page: NextPage<WorkPageProps> = props => {
  return <WorkPage {...props} />;
};

type Props = ServerSideProps<WorkPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);
  const { workId } = context.query;

  if (!looksLikeCanonicalId(workId)) {
    return { notFound: true };
  }

  const workResponse = await getWork({
    id: workId,
    shouldUseStagingApi: serverData.toggles.featureFlags.stagingApi,
    pipelineCluster: serverData.toggles.modes.cataloguePipeline,
  });

  if (workResponse.type === 'Redirect') {
    return {
      redirect: {
        destination: `/works/${workResponse.redirectToId}`,
        permanent: workResponse.status === 301,
      },
    };
  }

  if (workResponse.type === 'Error') {
    if (workResponse.httpStatus === 404) {
      return { notFound: true };
    }
    return appError(context, workResponse.httpStatus, workResponse.description);
  }

  const { url, ...work } = workResponse;

  // Only link to a category page that exists: the browse data leaves some
  // categories out (e.g. PSY and TP, see HIDDEN_ARCHIVE_CATEGORY_IDS) and
  // their pages 404, so a category missing from the list stays as plain text
  const archiveCategoryId = work.archive?.category.id;
  const showArchiveBrowsing = phaseIsAtLeast(
    serverData.toggles.phasedFlags.archiveBrowsingPhases,
    'mvp'
  );
  const archiveCategorySlug =
    archiveCategoryId && showArchiveBrowsing
      ? (await getArchiveCategories()).find(
          category => category.id === archiveCategoryId
        )?.slug
      : undefined;

  return {
    props: serialiseProps<Props>({
      work,
      archiveCategorySlug,
      apiUrl: url,
      serverData,
    }),
  };
};

export default Page;
