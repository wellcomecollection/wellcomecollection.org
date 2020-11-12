import { NextPage, NextPageContext } from 'next';
import Router from 'next/router';
import {
  Work as WorkType,
  CatalogueApiError,
} from '@weco/common/model/catalogue';
import { workLink } from '@weco/common/services/catalogue/routes';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import Work from '../components/Work/Work';
import { getWork } from '../services/catalogue/works';

type Props = {
  workResponse: WorkType | CatalogueApiError;
};

export const WorkPage: NextPage<Props> = ({ workResponse }) => {
  if (
    workResponse.type === 'Work' ||
    workResponse.type === 'Collection' ||
    workResponse.type === 'Section' ||
    workResponse.type === 'Series'
  ) {
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

WorkPage.getInitialProps = async (ctx: NextPageContext) => {
  const { id } = ctx.query;

  const workResponse = await getWork({
    id,
    toggles: ctx.query.toggles,
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
        const link = workLink({ id: workResponse.redirectToId });
        Router.push(link.href, link.as);
      }
    }

    return {
      workResponse:
        workResponse.type === 'Work' ||
        workResponse.type === 'Error' ||
        workResponse.type === 'Collection' ||
        workResponse.type === 'Section' ||
        workResponse.type === 'Series'
          ? workResponse
          : undefined,
    };
  }
};

export default WorkPage;
