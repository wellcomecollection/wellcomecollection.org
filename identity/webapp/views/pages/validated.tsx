import { NextPage } from 'next';

import { useUserContext } from '@weco/common/contexts/UserContext';
import Button from '@weco/common/views/components/Buttons';
import {
  ContaineredLayout,
  gridSize10,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import {
  ValidatedFailedText,
  ValidatedSuccessText,
} from '@weco/identity/utils/copy';
import {
  Container,
  Wrapper,
} from '@weco/identity/views/components/styled/Layouts';
import IdentityPageLayout from '@weco/identity/views/layouts/IdentityPageLayout';

export type Props = {
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
    <IdentityPageLayout title="Email verified">
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
    </IdentityPageLayout>
  );
};

export default ValidatedPage;
