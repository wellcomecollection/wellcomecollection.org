import { GetServerSideProps, NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import { serialiseProps } from '@weco/common/utils/json';
import { fetchIIIFPresentationManifest } from '@weco/content/services/iiif/fetch/manifest';
import { transformManifest } from '@weco/content/services/iiif/transformers/manifest';
import { looksLikeCanonicalId } from '@weco/content/services/wellcome/catalogue';
import { getWork } from '@weco/content/services/wellcome/catalogue/works';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { getDigitalLocationOfType } from '@weco/content/utils/works';
import WorkPage, {
  Props as WorkPageProps,
} from '@weco/content/views/works/work';

type Props = WorkPageProps & {
  pageview: Pageview;
  serverData: SimplifiedServerData; // TODO should we enforce this?
};

const Page: NextPage<WorkPageProps> = props => {
  return <WorkPage {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);
  const { workId } = context.query;

  if (!looksLikeCanonicalId(workId)) {
    return { notFound: true };
  }

  const workResponse = await getWork({
    id: workId,
    toggles: serverData.toggles,
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

  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );

  const iiifManifest =
    iiifPresentationLocation &&
    (await fetchIIIFPresentationManifest({
      location: iiifPresentationLocation.url,
      workTypeId: work.workType?.id,
    }));

  const transformedManifest = iiifManifest && transformManifest(iiifManifest);

  return {
    props: serialiseProps<Props>({
      work,
      transformedManifest,
      apiUrl: url,
      serverData,
      pageview: {
        name: 'work',
        // we shouldn't overload this
        // these metrics allow us to report back on breadth of collection accessed
        properties: {
          workType: workResponse.workType?.id,
          identifiers: workResponse.identifiers.map(id => id.value),
          identifierTypes: workResponse.identifiers.map(
            id => id.identifierType.id
          ),
        },
      },
    }),
  };
};

export default Page;
