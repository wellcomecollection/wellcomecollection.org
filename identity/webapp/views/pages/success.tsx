import { NextPage } from 'next';

import {
  ContaineredLayout,
  gridSize10,
  gridSize8,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { usePageTitle } from '@weco/identity/hooks/usePageTitle';
import { ApplicationReceived } from '@weco/identity/utils/copy';
import {
  Container,
  Wrapper,
} from '@weco/identity/views/components/styled/Layouts';
import IdentityPageLayout from '@weco/identity/views/layouts/IdentityPageLayout';

export type Props = {
  email: string;
};

const SuccessPage: NextPage<Props> = ({ email }) => {
  usePageTitle('Application received');

  return (
    <IdentityPageLayout title="Registration">
      <ContaineredLayout gridSizes={gridSize10()}>
        <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <ContaineredLayout gridSizes={gridSize8()}>
                <Space $v={{ size: 'xl', properties: ['padding-top'] }}>
                  <ApplicationReceived email={email} />
                </Space>
              </ContaineredLayout>
            </Wrapper>
          </Container>
        </Space>
      </ContaineredLayout>
    </IdentityPageLayout>
  );
};

export default SuccessPage;
