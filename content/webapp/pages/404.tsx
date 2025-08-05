import { NextPage } from 'next';

import ErrorPage from '@weco/common/views/layouts/ErrorPage';

const Page: NextPage = () => {
  return <ErrorPage statusCode={404} />;
};

export default Page;
