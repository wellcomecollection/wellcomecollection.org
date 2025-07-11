import { JwtPayload } from 'jsonwebtoken';
import { NextPage } from 'next';
import getConfig from 'next/config';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { isString } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { decodeToken } from '@weco/identity/utils/jwt-codec';
import RegistrationPage, {
  Props as RegistrationPageProps,
} from '@weco/identity/views/pages/registration';

const Page: NextPage<RegistrationPageProps> = props => {
  return <RegistrationPage {...props} />;
};

const { serverRuntimeConfig: config } = getConfig();

type Props = ServerSideProps<RegistrationPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  const serverData = await getServerData(context);
  const auth0State = isString(context.query.state)
    ? context.query.state
    : context.query.state?.join('');

  const sessionToken = isString(context.query.session_token)
    ? context.query.session_token
    : context.query.session_token?.join('');

  if (!sessionToken || !auth0State) {
    return appError(context, 500, 'Error connecting to auth');
  }

  let token: string | JwtPayload = '';
  let email = '';

  // We can get an error here if somebody tries to use an invalid session token;
  // which we return as a user error.
  try {
    token = decodeToken(sessionToken, config.auth0.actionSecret);
  } catch (error) {
    // There are non-nefarious reasons this might happen (eg expiry), so we redirect
    // to login as logging in will give the user a new token.
    console.error('Error decoding/validating session token', error);
    return {
      redirect: {
        permanent: false,
        destination: '/api/auth/login',
      },
    };
  }

  if (typeof token !== 'string') {
    email = token.email;
  }

  return {
    props: serialiseProps<Props>({
      serverData,
      sessionToken,
      auth0State,
      email,
    }),
  };
};

export default Page;
