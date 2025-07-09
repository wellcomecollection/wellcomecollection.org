import { FunctionComponent } from 'react';

import { info2 } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon';
import {
  ContaineredLayout,
  gridSize10,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import PageWrapper from '@weco/identity/views/components/PageWrapper';
import {
  Container,
  SectionHeading,
  Wrapper,
} from '@weco/identity/views/components/styled/layouts';

import { SuccessMessage } from './Registration.styles';

const AccountCreated: FunctionComponent = () => {
  return (
    <PageWrapper title="Account created">
      <ContaineredLayout gridSizes={gridSize10()}>
        <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <SectionHeading as="h1">
                Activate your library account
              </SectionHeading>
              <SuccessMessage>
                <Icon icon={info2} />
                Your library account has been created. Before you can sign in,
                you&apos;ll need to verify your email address.
              </SuccessMessage>
              <SpacingComponent />
              <p className="font-intr">
                We&apos;ve sent you an email with a link to verify your email
                address and activate your library account. Please do this within
                the next 24 hours, before the link expires.
              </p>
              <p className="font-intr">
                You won&apos;t be able to sign in until you have activated your
                account.
              </p>
              <h2 className="font-intb">Didn&apos;t receive an email?</h2>
              <p className="font-intr">
                If you don&apos;t see an email from us within the next few
                minutes, please check the following:
              </p>
              <ul>
                <li className="font-intr">
                  Is the email is in your spam/junk folder?
                </li>
                <li className="font-intr">
                  Was the email address you entered correct?
                </li>
              </ul>
              <p className="font-intb">
                If you still haven&apos;t received a verification email or need
                any other help with your account, please contact{' '}
                <a href="mailto:library@wellcomecollection.org">
                  Library enquiries
                </a>
                .
              </p>
            </Wrapper>
          </Container>
        </Space>
      </ContaineredLayout>
    </PageWrapper>
  );
};

export default AccountCreated;
