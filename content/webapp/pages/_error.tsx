import { NextPage } from 'next';

import ErrorPage from '@weco/common/views/layouts/ErrorPage';

type Props = { statusCode?: number };

const Page: NextPage<Props> = ({ statusCode }) => {
  return <ErrorPage statusCode={statusCode || 404} />;
};

Page.getInitialProps = ({ res, err }) => {
  // Pages set a cache time before fetching their data, so a 500 would keep it
  // and CloudFront would serve the error for that long
  if (res && res.statusCode >= 500) {
    res.setHeader('Cache-Control', 'no-store');
  }
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode, skipServerData: true };
};

export default Page;
