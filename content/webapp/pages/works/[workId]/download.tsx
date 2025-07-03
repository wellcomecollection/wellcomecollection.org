import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { fetchIIIFPresentationManifest } from '@weco/content/services/iiif/fetch/manifest';
import { transformManifest } from '@weco/content/services/iiif/transformers/manifest';
import { looksLikeCanonicalId } from '@weco/content/services/wellcome/catalogue';
import { toWorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { getWork } from '@weco/content/services/wellcome/catalogue/works';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { getDigitalLocationOfType } from '@weco/content/utils/works';
import WorkDownloadPage, {
  Props as WorkDownloadPageProps,
} from '@weco/content/views/works/work/download';

const Page: NextPage<WorkDownloadPageProps> = props => {
  return <WorkDownloadPage {...props} />;
};

type Props = ServerSideProps<WorkDownloadPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);
  const { workId } = context.query;

  if (!looksLikeCanonicalId(workId)) {
    return {
      notFound: true,
    };
  }

  const work = await getWork({
    id: workId,
    toggles: serverData.toggles,
  });

  if (work.type === 'Error') {
    return appError(context, work.httpStatus, work.description);
  } else if (work.type === 'Redirect') {
    return {
      redirect: {
        destination: `/works/${work.redirectToId}/download`,
        permanent: work.status === 301,
      },
    };
  }

  const manifestLocation = getDigitalLocationOfType(work, 'iiif-presentation');
  const iiifManifest =
    manifestLocation &&
    (await fetchIIIFPresentationManifest({ location: manifestLocation.url }));
  const transformedManifest = iiifManifest && transformManifest(iiifManifest);

  return {
    props: serialiseProps<Props>({
      serverData,
      transformedManifest: transformedManifest && {
        title: transformedManifest.title,
        iiifCredit: transformedManifest.iiifCredit,
        canvases: transformedManifest.canvases,
        rendering: transformedManifest.rendering,
      },
      work: {
        ...toWorkBasic(work),
        items: work.items,
      },
    }),
  };
};

export default Page;
