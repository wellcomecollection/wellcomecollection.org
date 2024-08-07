import { GetServerSideProps, NextPage } from 'next';
import { PageWrapper } from '@weco/identity/src/frontend/components/PageWrapper';
import { StyledButton } from '@weco/common/views/components/Buttons';
import CustomError from '@weco/identity/src/frontend/components/CustomError';
import {
  Container,
  Wrapper,
} from '@weco/identity/src/frontend/components/Layout.style';
import Layout, { gridSize10 } from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { themeValues } from '@weco/common/views/themes/config';

const ErrorPage: NextPage<Props> = ({ errorDescription }) => {
  return (
    <PageWrapper title="Error">
      <Layout gridSizes={gridSize10()}>
        <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <CustomError errorDescription={errorDescription}>
                <StyledButton
                  $colors={themeValues.buttonColors.greenTransparentGreen}
                >
                  <a
                    href="mailto:library@wellcomecollection.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact us
                  </a>
                </StyledButton>
              </CustomError>
            </Wrapper>
          </Container>
        </Space>
      </Layout>
    </PageWrapper>
  );
};

type Props = {
  serverData: SimplifiedServerData;
  errorDescription: string;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  const serverData = await getServerData(context);
  const { query } = context;
  const errorDescription = Array.isArray(query.error_description)
    ? query.error_description[0]
    : query.error_description;

  return {
    props: serialiseProps({
      serverData,
      errorDescription: errorDescription || 'Error',
    }),
  };
};
export default ErrorPage;
