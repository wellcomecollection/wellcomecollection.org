import { GetServerSideProps, NextPage } from 'next';
import { PageWrapper } from '../../src/frontend/components/PageWrapper';
import {
  Container,
  Title,
  Wrapper,
} from '../../src/frontend/components/Layout.style';
import { HighlightMessage } from '../../src/frontend/Registration/Registration.style';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  success: boolean;
  message: string | string[];
};

const ValidatedPage: NextPage<Props> = ({ success, message }) => {
  return (
    <PageWrapper>
      <Layout10>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              {success ? (
                <>
                  <Title>Email verified</Title>
                  <p>Thank you for verifying your email address.</p>
                  <p>
                    The library team will review your application and will
                    confirm your membership within the next 72 hours. In the
                    meantime, you can browse through{' '}
                    <a href="/collections">our digital collections</a> or sign
                    in to your account below.
                  </p>
                  <HighlightMessage>
                    <strong>Reminder:</strong> you will need to email a form of
                    personal identification (ID) and proof of address to the
                    Library team in order to confirm your details.
                  </HighlightMessage>
                  <ButtonSolidLink link="/account" text="Continue to Sign in" />
                </>
              ) : (
                <>
                  <Title>Failed to verify email</Title>
                  <p>{message}</p>
                  <div>
                    If you need help, please{' '}
                    <a
                      href="https://wellcomelibrary.org/using-the-library/services-and-facilities/contact-us/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      contact us
                    </a>
                  </div>
                </>
              )}
            </Wrapper>
          </Container>
        </Space>
      </Layout10>
    </PageWrapper>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const { query } = context;
  const { success, message } = query;

  return {
    props: {
      success: success === 'true',
      message: message || null,
    },
  };
};

export default ValidatedPage;
