import { NextPage, GetServerSideProps } from 'next';
import {
  Container,
  Wrapper,
} from '@weco/identity/src/frontend/components/Layout.style';
import { PageWrapper } from '@weco/identity/src/frontend/components/PageWrapper';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { DeleteRequestedText } from '@weco/identity/copy';

const DeleteRequestedPage: NextPage = () => {
  return (
    <PageWrapper title="Delete request">
      <Layout10>
        <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <DeleteRequestedText />
            </Wrapper>
          </Container>
        </Space>
      </Layout10>
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
    props: serialiseProps({
      serverData,
    }),
  };
};

export default DeleteRequestedPage;
