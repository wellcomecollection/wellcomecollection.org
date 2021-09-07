import React from 'react';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import { useLocationQuery } from '../../hooks/useLocationQuery';
import { PageWrapper } from '../PageWrapper';
import { Container, Wrapper } from '../Layout.style';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';

type ErrorParams = {
  error: string;
  error_description: string;
};

export const ErrorPage = (): JSX.Element => {
  const { error_description } = useLocationQuery<ErrorParams>();

  return (
    <PageWrapper>
      <Layout10>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <h1 className="font-wb font-size-1">An error occurred</h1>

              <p className="font-hnr font-size-4">{error_description}</p>
              <SpacingComponent />
              <OutlinedButton>
                <a
                  href="mailto:library@wellcomecollection.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact us
                </a>
              </OutlinedButton>
            </Wrapper>
          </Container>
        </Space>
      </Layout10>
    </PageWrapper>
  );
};
