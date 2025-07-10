import { NextPage } from 'next';

import {
  ContaineredLayout,
  gridSize10,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import PageWrapper from '@weco/identity/views/components/PageWrapper';
import {
  Container,
  SectionHeading,
  Wrapper,
} from '@weco/identity/views/components/styled/layouts';

const DeleteRequestedPage: NextPage = () => {
  return (
    <PageWrapper title="Delete request">
      <ContaineredLayout gridSizes={gridSize10()}>
        <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <>
                <SectionHeading as="h1">Delete request received</SectionHeading>

                <p>Your request for account deletion has been received.</p>

                <p>
                  Our Library enquiries team will now progress your request. If
                  there are any issues they will be in touch otherwise your
                  account will be removed.
                </p>
                <p>
                  <a href="/">Return to homepage</a>
                </p>
              </>
            </Wrapper>
          </Container>
        </Space>
      </ContaineredLayout>
    </PageWrapper>
  );
};

export default DeleteRequestedPage;
