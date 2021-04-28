import { NextPage } from 'next';
import {
  getGlobalContextData,
  GlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';

type Props = {
  statusCode?: number;
  message: string;
  globalContextData: GlobalContextData;
};

const Page: NextPage<Props> = ({
  message,
  statusCode,
  globalContextData,
}: Props) => {
  return (
    <ErrorPage
      title={message}
      statusCode={statusCode}
      globalContextData={globalContextData}
    />
  );
};

Page.getInitialProps = async context => {
  const globalContextData = getGlobalContextData(context);

  return {
    message: 'Something unexpected happened. Our team will be looking into it.',
    statusCode: context?.res?.statusCode,
    globalContextData,
  };
};

export default Page;
