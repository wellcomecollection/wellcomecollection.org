import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import auth0 from '@weco/identity/utils/auth0';
import ValidatedPage, {
  Props as ValidatedPageProps,
} from '@weco/identity/views/pages/validated';

const Page: NextPage<ValidatedPageProps> = props => {
  return <ValidatedPage {...props} />;
};

type Props = ServerSideProps<ValidatedPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  const { query, req, res } = context;
  const { success, message, supportSignUp } = query;
  const didSucceed = success === 'true';

  if (didSucceed) {
    // The email validation state is held within the ID token, which we need to
    // refresh after fetching a new access token.
    try {
      await auth0.getAccessToken(req, res, { refresh: true });
      await auth0.getSession(req, res);
    } catch {
      // It doesn't matter if this fails; it means the user doesn't currently have a session
    }
  }

  const serverData = await getServerData(context);

  return {
    props: serialiseProps<Props>({
      serverData,
      success: didSucceed,
      message: message || '',
      isNewSignUp: supportSignUp === 'true',
    }),
  };
};

export default Page;
