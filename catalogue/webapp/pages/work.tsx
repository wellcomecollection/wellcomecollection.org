import { GetServerSideProps, NextPage } from 'next';
import {
  Work as WorkType,
  CatalogueApiError,
} from '@weco/common/model/catalogue';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import Work from '../components/Work/Work';
import { getWork } from '../services/catalogue/works';
import {
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
    <>
      {workResponse.type === 'Error' && (
        <ErrorPage
          statusCode={workResponse.httpStatus}
          title={workResponse.description}
          globalContextData={globalContextData}
        />
      )}
      {workResponse.type !== 'Error' && (
        <Work work={workResponse} globalContextData={globalContextData} />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const globalContextData = getGlobalContextData(context);
  const { id } = context.query;

  const workResponse = await getWork({
    id,
    toggles: globalContextData.toggles,
  });

  if (workResponse.type === 'Redirect') {
    return {
      props: {},
      redirect: {
        destination: workResponse.redirectToId,
        permanent: workResponse.status === 301,
      },
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
