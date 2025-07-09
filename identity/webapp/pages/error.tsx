import { GetServerSideProps, NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { StyledButton } from '@weco/common/views/components/Buttons';
import {
  ContaineredLayout,
  gridSize10,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import CustomError from '@weco/identity/views/components/CustomError';
import PageWrapper from '@weco/identity/views/components/PageWrapper';
import {
  Container,
  Wrapper,
} from '@weco/identity/views/components/styled/layouts';

const ErrorPage: NextPage<Props> = ({ errorDescription }) => {
  return (
    <PageWrapper title="Error">
      <ContaineredLayout gridSizes={gridSize10()}>
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
      </ContaineredLayout>
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
    props: serialiseProps<Props>({
      serverData,
      errorDescription: errorDescription || 'Error',
    }),
  };
};
export default ErrorPage;
