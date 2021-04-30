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

// FIXME: this is not a method Next recommend anymore, although it is currently
// the best option for getting server data for the _error page (which is otherwise statically exported).
// It also means that we have had to add `NextPageContext` as a possible type to `getGlobalContextData`'s
// `context` argument.
Page.getInitialProps = async context => {
  const globalContextData = getGlobalContextData(context);

  return {
    message: 'Something unexpected happened. Our team will be looking into it.',
    statusCode: context?.res?.statusCode,
    globalContextData,
  };
};

export default Page;
