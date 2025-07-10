import { GetServerSideProps, NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ContaineredLayout,
  gridSize10,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import PageWrapper from '@weco/identity/components/PageWrapper';
import { Container, Wrapper } from '@weco/identity/components/styled/layouts';
import { DeleteRequestedText } from '@weco/identity/utils/copy';

const DeleteRequestedPage: NextPage = () => {
  return (
    <PageWrapper title="Delete request">
      <ContaineredLayout gridSizes={gridSize10()}>
        <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <DeleteRequestedText />
            </Wrapper>
          </Container>
        </Space>
      </ContaineredLayout>
    </PageWrapper>
  );
};

type Props = {
  serverData: SimplifiedServerData;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  const serverData = await getServerData(context);

  return {
    props: serialiseProps<Props>({
      serverData,
    }),
  };
};

export default DeleteRequestedPage;
