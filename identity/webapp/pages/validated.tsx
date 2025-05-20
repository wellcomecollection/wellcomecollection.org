import { GetServerSideProps, NextPage } from 'next';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import Button from '@weco/common/views/components/Buttons';
import {
  ContaineredLayout,
  gridSize10,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import PageWrapper from '@weco/identity/components/PageWrapper';
import { Container, Wrapper } from '@weco/identity/components/styled/layouts';
import auth0 from '@weco/identity/utils/auth0';
import {
  ValidatedFailedText,
  ValidatedSuccessText,
} from '@weco/identity/utils/copy';

type Props = {
  serverData: SimplifiedServerData;
  success: boolean;
  message: string | string[];
  isNewSignUp: boolean;
};

const ValidatedPage: NextPage<Props> = ({ success, message, isNewSignUp }) => {
  const { state: userState } = useUserContext();
  const urlUsed = message === 'This URL can be used only once';

  // As discussed here https://github.com/wellcomecollection/wellcomecollection.org/issues/6952
  // we want to show the success message in this scenario, and the message value is the only thing we can use to determine that
  // auth0.com/docs/brand-and-customize/email/email-template-descriptions#redirect-to-results-for-verification-email-template
  return (
    <PageWrapper title="Email verified">
      <ContaineredLayout gridSizes={gridSize10()}>
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
      </ContaineredLayout>
    </PageWrapper>
  );
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
      await auth0.getSession(req, res); // TODO replace?
    } catch (e) {
      // It doesn't matter if this fails; it means the user doesn't currently have a session
    }
  }

  const serverData = await getServerData(context);

  return {
    props: serialiseProps({
      serverData,
      success: didSucceed,
      message: message || '',
      isNewSignUp: supportSignUp === 'true',
    }),
  };
};

export default ValidatedPage;
