import { NextPage, GetServerSideProps, GetServerSidePropsContext } from 'next';
import { PageWrapper } from '../src/frontend/components/PageWrapper';
import {
  Container,
  Wrapper,
  SectionHeading,
} from '../src/frontend/components/Layout.style';
import { usePageTitle } from '../src/frontend/hooks/usePageTitle';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import Divider from '@weco/common/views/components/Divider/Divider';

type Props = {
  serverData: SimplifiedServerData;
  email: string;
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async (context: GetServerSidePropsContext) => {
    const serverData = await getServerData(context);

    const { email } = context.query;

    return {
      props: removeUndefinedProps({
        serverData,
        email: email as string,
      }),
    };
  };

const SuccessPage: NextPage<Props> = ({ email }) => {
  usePageTitle('Application received');

  return (
    <PageWrapper title={`Registration`}>
      <Layout10>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <Layout8>
                <Space v={{ size: 'xl', properties: ['padding-top'] }}>
                  <SectionHeading as="h1">Application received</SectionHeading>
                  <div className="body-text">
                    <p>Thank you for applying for a library membership.</p>
                    <p>
                      Please click the verification link in the email we’ve just
                      sent to <strong>{email}</strong>.
                    </p>
                    <p>
                      <strong>Please do this within the next 24 hours.</strong>
                    </p>
                    <p>
                      Once you have verified your email address, you will be
                      able to request up to 15 items from our closed stores to
                      view in the library.
                    </p>
                    <p>
                      If you want to access subscription databases, e-journals
                      and e-books, you need to bring a form of personal
                      identification (ID) and proof of address to the admissions
                      desk in the library.
                    </p>
                    <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                      <Divider color={`pumice`} isKeyline />
                    </Space>
                    <p>
                      <strong>Didn’t receive an email?</strong>
                    </p>
                    <p>
                      If you still don’t see an email from us within the next
                      few minutes, try checking your junk or spam folder.
                    </p>
                    <p>
                      If you need more help please{' '}
                      <a href="mailto:library@wellcomecollection.org">
                        contact the library
                      </a>
                      .
                    </p>
                  </div>
                </Space>
              </Layout8>
            </Wrapper>
          </Container>
        </Space>
      </Layout10>
    </PageWrapper>
  );
};

export default SuccessPage;
