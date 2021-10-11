import { GetServerSideProps, NextPage } from 'next';
import { Work as WorkType } from '@weco/common/model/catalogue';
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
import { getServerData } from '@weco/common/server-data';
import Work from '../components/Work/Work';
import { getWork } from '../services/catalogue/works';

type Props = {
  workResponse: WorkType;
} & WithGlobalContextData &
  WithPageview;

export const WorkPage: NextPage<Props> = ({
  workResponse,
  globalContextData,
}) => {
  // TODO: remove the <Work> component and move the JSX in here.
  // It was abstracted as we did error handling in the page, and it made it a little clearer.
  return <Work work={workResponse} globalContextData={globalContextData} />;
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
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
      return appError(
        context,
        workResponse.httpStatus,
        workResponse.description
      );
    }

    return {
      props: removeUndefinedProps({
        workResponse,
        globalContextData,
        serverData,
        pageview: {
          name: 'work',
          // we shouldn't overload this
          // these metrics allow us to report back on breadth of collection accessed
          properties: {
            workType: workResponse.workType,
            identifiers: workResponse.identifiers,
          },
        },
      }),
    };
  };

export default WorkPage;
