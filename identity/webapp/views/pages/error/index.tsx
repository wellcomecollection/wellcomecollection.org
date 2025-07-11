import { NextPage } from 'next';
import { FunctionComponent, PropsWithChildren } from 'react';

import { StyledButton } from '@weco/common/views/components/Buttons';
import {
  ContaineredLayout,
  gridSize10,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import {
  Container,
  SectionHeading,
  Wrapper,
} from '@weco/identity/views/components/styled/Layouts';
import IdentityPageLayout from '@weco/identity/views/layouts/IdentityPageLayout';

export type Props = {
  errorDescription: string;
};

const CustomError: FunctionComponent<PropsWithChildren<Props>> = ({
  errorDescription,
  children,
}) => {
  if (errorDescription === 'user is blocked') {
    return (
      <>
        <SectionHeading as="h1">Library account blocked</SectionHeading>
        <p>
          Your account can no longer be accessed. Please email{' '}
          <a href="mailto:library@wellcomecollection.org">
            library@wellcomecollection.org
          </a>{' '}
          for assistance.
        </p>
      </>
    );
  }

  return (
    <>
      <SectionHeading as="h1">An error occurred</SectionHeading>
      <p>{errorDescription}</p>
      {children}
    </>
  );
};

const ErrorPage: NextPage<Props> = ({ errorDescription }) => {
  return (
    <IdentityPageLayout title="Error">
      <ContaineredLayout gridSizes={gridSize10()}>
        <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <CustomError errorDescription={errorDescription}>
                <StyledButton
                  $colors={themeValues.buttonColors.greenTransparentGreen}
                >
                  <a
                    href="mailto:library@wellcomecollection.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact us
                  </a>
                </StyledButton>
              </CustomError>
            </Wrapper>
          </Container>
        </Space>
      </ContaineredLayout>
    </IdentityPageLayout>
  );
};

export default ErrorPage;
