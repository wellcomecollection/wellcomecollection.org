import { NextPage } from 'next';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';

const Page: NextPage = () => {
  return <ErrorPage statusCode={404} globalContextData={{}} />;
};

export default Page;
