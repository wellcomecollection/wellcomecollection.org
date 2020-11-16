import { GetServerSideProps, NextPage } from 'next';
import {
  Work as WorkType,
  CatalogueApiError,
} from '@weco/common/model/catalogue';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import Work from '../components/Work/Work';
import { getWork } from '../services/catalogue/works';
import GlobalContextProvider, {
  GlobalContextData,
  getGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';

type Props = {
  workResponse: WorkType | CatalogueApiError;
  globalContextData: GlobalContextData;
};

export const WorkPage: NextPage<Props> = ({
  workResponse,
  globalContextData,
}: Props) => {
  return (
    <GlobalContextProvider value={globalContextData}>
      {workResponse.type === 'Error' && (
        <ErrorPage
          statusCode={workResponse.httpStatus}
          title={workResponse.description}
        />
      )}
      {workResponse.type !== 'Error' && <Work work={workResponse} />}
    </GlobalContextProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const globalContextData = getGlobalContextData(context);
  const { id } = context.query;

  const workResponse = await getWork({
    id,
    toggles: globalContextData.toggles,
  });

  if (workResponse.type === 'NotFound') {
    return {
      props: {},
      notFound: true,
    };
  }

  if (workResponse.type === 'Redirect') {
    return {
      props: {},
      destination: workResponse.redirectToId,
      permanent: workResponse.status === 301,
    };
  }

  return {
    props: {
      workResponse,
      globalContextData,
    },
  };
};

export default WorkPage;
