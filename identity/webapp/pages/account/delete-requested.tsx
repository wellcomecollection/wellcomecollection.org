import { NextPage, GetServerSideProps } from 'next';
import { Container, Wrapper } from '../../src/frontend/components/Layout.style';
import { PageWrapper } from '../../src/frontend/components/PageWrapper';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { ServerData } from '@weco/common/server-data/types';

const DeleteRequestedPage: NextPage = () => {
  return (
    <PageWrapper title={`Delete request`}>
      <Layout10>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <h1 className="font-wb font-size-1">Delete request received</h1>
              <p className="font-hnr font-size-4">
                Your request for account deletion has been received.
              </p>

              <p className="font-hnr font-size-4">
                Our Library enquiries team will now progress your request. If
                there are any issues they will be in touch otherwise your
                account will be removed.
              </p>
              <p className="font-hnr font-size-4">
                <a href="/">Return to homepage</a>
              </p>
            </Wrapper>
          </Container>
        </Space>
      </Layout10>
    </PageWrapper>
  );
};

type Props = {
  serverData: ServerData;
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);

    return {
      props: removeUndefinedProps({
        serverData,
      }),
    };
  };

export default DeleteRequestedPage;
