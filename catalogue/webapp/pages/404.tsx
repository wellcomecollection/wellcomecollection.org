import { NextPage } from 'next';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import { defaultValue } from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';

const Page: NextPage = () => {
  return <ErrorPage statusCode={404} globalContextData={defaultValue} />;
};

export default Page;
