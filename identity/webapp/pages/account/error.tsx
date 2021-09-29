import { GetServerSideProps, NextPage } from 'next';
import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import { PageWrapper } from '../../src/frontend/components/PageWrapper';
import { Container, Wrapper } from '../../src/frontend/components/Layout.style';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  errorDescription: string | string[];
};

const ErrorPage: NextPage<Props> = ({ errorDescription }) => {
  return (
    <PageWrapper>
      <Layout10>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <h1 className="font-wb font-size-1">An error occurred</h1>

              <p className="font-hnr font-size-4">{errorDescription}</p>
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

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const { query } = context;
  const errorDescription = query.error_description || null;

  return {
    props: {
      errorDescription,
    },
  };
};

export default ErrorPage;
