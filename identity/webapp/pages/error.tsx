import { GetServerSideProps, NextPage } from 'next';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import { PageWrapper } from '../src/frontend/components/PageWrapper';
import {
  Container,
  Wrapper,
  SectionHeading,
} from '../src/frontend/components/Layout.style';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { SimplifiedServerData } from '@weco/common/server-data/types';

const ErrorPage: NextPage<Props> = ({ errorDescription }) => {
  return (
    <PageWrapper title={`Error`}>
      <Layout10>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <SectionHeading as="h1">An error occurred</SectionHeading>

              <p>{errorDescription}</p>
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

type Props = {
  serverData: SimplifiedServerData;
  errorDescription: string | string[];
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const { query } = context;
    const errorDescription = query.error_description;
    const serverData = await getServerData(context);

    return {
      props: removeUndefinedProps({
        serverData,
        errorDescription,
      }),
    };
  };
export default ErrorPage;
