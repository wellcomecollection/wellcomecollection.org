import { FunctionComponent } from 'react';
import { headerBackgroundLs } from '../../../utils/backgrounds';
import PageHeader, { headerSpaceSize } from '../PageHeader/PageHeader';
import PageLayout from '../PageLayout/PageLayout';
import SpacingSection from '../SpacingSection/SpacingSection';
import SpacingComponent from '../SpacingComponent/SpacingComponent';
import Space from '../styled/Space';
import { isNotUndefined } from '../../../utils/array';
import {
  DefaultErrorText,
  NotFoundErrorText,
  errorMessages,
} from '../../../data/errors';

type Props = {
  statusCode?: number;
  title?: string;
};

const ErrorPage: FunctionComponent<Props> = ({
  statusCode = 500,
  title,
}: Props) => {
  const errorMessage = isNotUndefined(title)
    ? title
    : statusCode in errorMessages
    ? errorMessages[statusCode]
    : errorMessages[500];

  return (
    <PageLayout
      title={`${statusCode}`}
      description={`${statusCode}`}
      url={{ pathname: `/` }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType={'website'}
      hideNewsletterPromo={true}
      siteSection={null}
    >
      <Space v={{ size: headerSpaceSize, properties: ['padding-bottom'] }}>
        <PageHeader
          breadcrumbs={{ items: [] }}
          labels={undefined}
          title={errorMessage}
          ContentTypeInfo={undefined}
          Background={undefined}
          backgroundTexture={headerBackgroundLs}
          FeaturedMedia={undefined}
          HeroPicture={undefined}
          highlightHeading={true}
        />
        <SpacingSection>
          <SpacingComponent>
            {statusCode === 404 ? <NotFoundErrorText /> : <DefaultErrorText />}
          </SpacingComponent>
        </SpacingSection>
      </Space>
    </PageLayout>
  );
};

export default ErrorPage;
