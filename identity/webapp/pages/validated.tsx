import { GetServerSideProps, NextPage } from 'next';
import { PageWrapper } from '@weco/identity/src/frontend/components/PageWrapper';
import {
  Container,
  Wrapper,
} from '@weco/identity/src/frontend/components/Layout.style';
import Button from '@weco/common/views/components/Buttons';
import Layout, { gridSize10 } from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { useUser } from '@weco/common/views/components/UserProvider/UserProvider';
import auth0 from '@weco/identity/src/utility/auth0';
import { ValidatedFailedText, ValidatedSuccessText } from '@weco/identity/copy';

const ValidatedPage: NextPage<Props> = ({ success, message, isNewSignUp }) => {
  const { state: userState } = useUser();
  const urlUsed = message === 'This URL can be used only once';

  // As discussed here https://github.com/wellcomecollection/wellcomecollection.org/issues/6952
  // we want to show the success message in this scenario, and the message value is the only thing we can use to determine that
  // auth0.com/docs/brand-and-customize/email/email-template-descriptions#redirect-to-results-for-verification-email-template
  return (
    <PageWrapper title="Email verified">
      <Layout gridSizes={gridSize10()}>
        <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              {success || urlUsed ? (
                <>
                  <ValidatedSuccessText isNewSignUp={isNewSignUp} />
                  <Button
                    variant="ButtonSolidLink"
                    link="/account"
                    text={
                      userState === 'signedin'
                        ? 'View your library account'
                        : 'Sign in'
                    }
                  />
                </>
              ) : (
                <ValidatedFailedText message={message} />
              )}
            </Wrapper>
          </Container>
        </Space>
      </Layout>
    </PageWrapper>
  );
};

type Props = {
  serverData: SimplifiedServerData;
  success: boolean;
  message: string | string[];
  isNewSignUp: boolean;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
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
    } catch (e) {
      // It doesn't matter if this fails; it means the user doesn't currently have a session
    }
  }

  const serverData = await getServerData(context);

  return {
    props: serialiseProps({
      serverData,
      success: didSucceed,
      message: message || null,
      isNewSignUp: supportSignUp === 'true',
    }),
  };
};

export default ValidatedPage;
