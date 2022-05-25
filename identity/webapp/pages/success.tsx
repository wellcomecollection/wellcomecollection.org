import { NextPage, GetServerSideProps } from 'next';
import { withPageAuthRequiredSSR } from '../src/utility/auth0';
import { PageWrapper } from '../src/frontend/components/PageWrapper';
import {
  Container,
  Wrapper,
  SectionHeading,
} from '../src/frontend/components/Layout.style';
import { usePageTitle } from '../src/frontend/hooks/usePageTitle';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { useUser } from '@weco/common/views/components/UserProvider/UserProvider';
import { Claims } from '@auth0/nextjs-auth0';
import Divider from '@weco/common/views/components/Divider/Divider';

import {
  Auth0UserProfile,
  auth0UserProfileToUserInfo,
} from '@weco/common/model/user';

type Props = {
  serverData: SimplifiedServerData;
  user?: Claims;
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  withPageAuthRequiredSSR({
    getServerSideProps: async context => {
      const serverData = await getServerData(context);

      if (!serverData.toggles.selfRegistration) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }

      return {
        props: removeUndefinedProps({
          serverData,
        }),
      };
    },
  });

const SuccessPage: NextPage<Props> = ({ user: auth0UserClaims }) => {
  usePageTitle('Application received');
  const { user: contextUser } = useUser();

  const user =
    contextUser ||
    auth0UserProfileToUserInfo(auth0UserClaims as Auth0UserProfile);

  return (
    <PageWrapper title={`Registration`}>
      <Layout10>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <Layout8>
                <Space v={{ size: 'xl', properties: ['padding-top'] }}>
                  <SectionHeading as="h1">Application received</SectionHeading>
                  <div className="body-text">
                    <p>Thank you for applying for a library membership.</p>
                    <p>
                      To activate your online account, please click the
                      verification link in the email we’ve just sent to{' '}
                      <strong>{user.email}</strong>.
                    </p>
                    <p>Please do this within the next 24 hours.</p>
                    <ul>
                      <li>
                        Request up to 15 materials from our closed stores to
                        view in the library
                      </li>
                      <li>
                        Access subscription databases and other online
                        resources.
                      </li>
                    </ul>
                    <p>
                      When you complete your registration online, you’ll need to
                      email a form of personal identification (ID) and proof of
                      address to the Library team in order to confirm your
                      membership. Your membership will be confirmed within 72
                      hours.
                    </p>
                    <Divider color={`pumice`} isKeyline />
                    <h2 className="h3">Didn’t receive an email?</h2>
                    <p>
                      If you still don’t see an email from us within the next
                      few minutes, try checking your junk or spam folder.
                    </p>
                    <p>If you need more help please contact the library.</p>
                  </div>
                </Space>
              </Layout8>
            </Wrapper>
          </Container>
        </Space>
      </Layout10>
    </PageWrapper>
  );
};

export default SuccessPage;
