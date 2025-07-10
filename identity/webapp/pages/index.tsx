import { NextPage } from 'next';
import { URLSearchParams } from 'url';

import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import auth0, { withPageAuthRequiredSSR } from '@weco/identity/utils/auth0';
import AccountPage, {
  Props as AccountPageProps,
} from '@weco/identity/views/pages';

const Page: NextPage<AccountPageProps> = props => {
  return <AccountPage {...props} />;
};

type Props = ServerSideProps<AccountPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<Props> =
  withPageAuthRequiredSSR({
    getServerSideProps: async context => {
      const serverData = await getServerData(context);

      // When a user goes through the registration flow, we create a user
      // with a placeholder name and *then* update their name in Sierra.
      //
      // This causes an issue if they go from the registration flow directly
      // to their account page:
      //
      //    - We can't update their name directly with the Auth0 management
      //      API, because it's synced from Sierra.
      //    - Auth0 syncs data from Sierra whenever the user authenticates,
      //      i.e. logs in [2], and despite trying I haven't found an easy way
      //      to get Auth0 to re-sync without a login.
      //
      // So to get something working for sign-up, we assume that anybody who
      // signs in with the placeholder surname has just signed up, and we log
      // them out and redirect to the /success page.
      //
      // When they log back in, Auth0 will re-sync their data and pick up their
      // updated name.
      //
      // This is less than ideal, but it gets _something_ working, and we can
      // revisit re-syncing user data without a login later.
      //
      // [1]: https://wellcome.slack.com/archives/CUA669WHH/p1656325929053499?thread_ts=1656322401.443269&cid=CUA669WHH
      // [2]: https://auth0.com/docs/manage-users/user-accounts/user-profiles#caching-user-profiles
      //
      const session = await auth0.getSession(context.req, context.res);

      if (!session)
        return {
          props: serialiseProps<Props>({
            serverData,
          }),
        };

      if (session.user.family_name === 'Auth0_Registration_tempLastName') {
        const successParams = new URLSearchParams();
        successParams.append('email', session.user.email);

        const params = new URLSearchParams();
        params.append('returnTo', `/success?${successParams}`);

        return {
          redirect: {
            destination: `/api/auth/logout?${params}`,
            permanent: false,
          },
        };
      }

      return {
        props: serialiseProps<Props>({
          serverData,
        }),
      };
    },
  });

export default Page;
