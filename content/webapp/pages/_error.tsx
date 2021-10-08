import { NextPage } from 'next';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import { defaultValue } from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';

type Props = { statusCode?: number };

const Page: NextPage<Props> = ({ statusCode }) => {
  return (
    <ErrorPage
      statusCode={statusCode || 404}
      globalContextData={defaultValue}
    />
  );
};

// We currently do this to allow the page to work locally
// mainly around deleting memoizedPrismic which creates a
// circular dep as it's an object with methods on, not just data
Page.getInitialProps = ({ query, res, err }) => {
  delete query.memoizedPrismic;
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Page;
