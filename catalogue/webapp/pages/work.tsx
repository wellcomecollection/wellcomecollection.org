import Router from 'next/router';
import {
  Work as WorkType,
  CatalogueApiError,
  CatalogueApiRedirect,
} from '@weco/common/model/catalogue';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import Work from '../components/Work/Work';
import { getWork } from '../services/catalogue/works';

type Props = {
  workResponse: WorkType | CatalogueApiError;
};

export const WorkPage = ({ workResponse }: Props) => {
  if (workResponse.type === 'Work') {
    return <Work work={workResponse} />;
  }

  if (workResponse.type === 'Error') {
    return (
      <ErrorPage
        statusCode={workResponse.httpStatus}
        title={workResponse.description}
      />
    );
  }
};

WorkPage.getInitialProps = async (
  ctx
): Promise<Props | CatalogueApiRedirect> => {
  const { id } = ctx.query;
  const { stagingApi } = ctx.query.toggles;

  const workResponse = await getWork({
    id,
    env: stagingApi ? 'stage' : 'prod',
  });

  if (workResponse) {
    if (workResponse.type === 'Redirect') {
      const { res } = ctx;
      if (res) {
        res.writeHead(workResponse.status, {
          Location: workResponse.redirectToId,
        });
        res.end();
      } else {
        Router.push(workResponse.redirectToId);
      }
      return workResponse;
    }

    if (workResponse.type === 'Work' || workResponse.type === 'Error') {
      return {
        workResponse: workResponse,
      };
    }
  }
};

export default WorkPage;
