import { GetServerSideProps, NextPage } from 'next';
import { Work as WorkType } from '@weco/content/services/wellcome/catalogue/types';
import { serialiseProps } from '@weco/common/utils/json';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import { getServerData } from '@weco/common/server-data';
import Work from '@weco/content/components/Work/Work';
import { getWork } from '@weco/content/services/wellcome/catalogue/works';
import { looksLikeCanonicalId } from '@weco/content/services/wellcome/catalogue';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { getDigitalLocationOfType } from '@weco/content/utils/works';
import { fetchIIIFPresentationManifest } from '@weco/content/services/iiif/fetch/manifest';
import { WorkContextProvider } from '@weco/content/contexts/WorkContext';

type Props = {
  work: WorkType;
  apiUrl: string;
  hasIIIFManifest: boolean;
  pageview: Pageview;
};

export const WorkPage: NextPage<Props> = ({
  work,
  apiUrl,
  hasIIIFManifest,
}) => {
  // TODO: remove the <Work> component and move the JSX in here.
  // It was abstracted as we did error handling in the page, and it made it a little clearer.
  return (
    <WorkContextProvider>
      <Work work={work} apiUrl={apiUrl} hasIIIFManifest={hasIIIFManifest} />
    </WorkContextProvider>
  );
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
    (await fetchIIIFPresentationManifest(iiifPresentationLocation.url));

  return {
    props: serialiseProps({
      work,
      hasIIIFManifest: !!iiifManifest,
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

export default WorkPage;
