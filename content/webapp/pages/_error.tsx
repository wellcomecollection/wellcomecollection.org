import { NextPage } from 'next';

import ErrorPage from '@weco/common/views/layouts/ErrorPage';

type Props = { statusCode?: number };

const Page: NextPage<Props> = ({ statusCode }) => {
  return <ErrorPage statusCode={statusCode || 404} />;
};

Page.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode, skipServerData: true };
};

export default Page;
