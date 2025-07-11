import { NextPage } from 'next';
import { FunctionComponent } from 'react';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import Button from '@weco/common/views/components/Buttons';
import {
  ContaineredLayout,
  gridSize10,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import {
  Container,
  SectionHeading,
  Wrapper,
} from '@weco/identity/views/components/styled/ALayouts';
import IdentityPageLayout from '@weco/identity/views/layouts/IdentityPageLayout';

export type Props = {
  success: boolean;
  message: string | string[];
  isNewSignUp: boolean;
};

const ValidatedFailedText: FunctionComponent<{
  message: string | string[];
}> = ({ message }) => (
  <>
    <SectionHeading as="h1">Failed to verify email</SectionHeading>
    <p>{message}</p>
    <p>
      If you need help, please{' '}
      <a href="mailto:library@wellcomecollection.org">contact the library</a>.
    </p>
  </>
);

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
                  <>
                    <SectionHeading as="h1">Email verified</SectionHeading>
                    <p>Thank you for verifying your email address.</p>

                    {isNewSignUp && (
                      <div data-testid="new-sign-up">
                        <p>
                          You can now request up to 15 items from our closed
                          stores in the library.
                        </p>
                        <p>
                          To complete your membership and access subscription
                          databases, e-journals and e-books, you’ll need to
                          bring a form of photo identification (ID) and proof of
                          your address to our admissions desk when you visit.
                          The identification we accept is detailed on our{' '}
                          <a
                            href={`https://wellcomecollection.org/collections/${prismicPageIds.register}`}
                          >
                            Library membership page
                          </a>
                          .
                        </p>
                      </div>
                    )}
                  </>

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
