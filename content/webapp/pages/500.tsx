import { NextPage } from 'next';

import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';

const Page: NextPage = () => {
  return <ErrorPage statusCode={500} />;
};

export default Page;
