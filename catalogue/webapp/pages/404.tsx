import { NextPage } from 'next';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';

const Page: NextPage = () => {
  console.log('Get ignored by Chromatic');
  return <ErrorPage statusCode={404} />;
};

export default Page;
