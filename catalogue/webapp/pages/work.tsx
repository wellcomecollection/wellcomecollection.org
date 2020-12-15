import { GetServerSideProps, NextPage } from 'next';
import { Work as WorkType } from '@weco/common/model/catalogue';
import Work from '../components/Work/Work';
import { getWork } from '../services/catalogue/works';
import {
  getGlobalContextData,
  WithGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import { removeUndefinedProps } from '@weco/common/utils/json';
import {
  appError,
  AppErrorProps,
  WithPageview,
} from '@weco/common/views/pages/_app';

type Props = {
  workResponse: WorkType;
} & WithGlobalContextData &
  WithPageview;

export const WorkPage: NextPage<Props> = ({
  workResponse,
  globalContextData,
}: Props) => {
  // TODO: remove the <Work> component and move the JSX in here.
  // It was abstracted as we did error handling in the page, and it made it a little clearer.
  return <Work work={workResponse} globalContextData={globalContextData} />;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  const globalContextData = getGlobalContextData(context);
  const { id } = context.query;

  if (typeof id !== 'string') {
    return { notFound: true };
  }

  const workResponse = await getWork({
    id,
    toggles: globalContextData.toggles,
  });

  if (workResponse.type === 'Redirect') {
    return {
      redirect: {
        destination: workResponse.redirectToId,
        permanent: workResponse.status === 301,
      },
    };
  }

  if (workResponse.type === 'Error') {
    if (workResponse.httpStatus === 404) {
      return { notFound: true };
    }
    return appError(context, workResponse.httpStatus, 'Works API error');
  }

  return {
    props: removeUndefinedProps({
      workResponse,
      globalContextData,
      pageview: {
        name: 'work',
        properties: {},
      },
    }),
  };
};

export default WorkPage;
