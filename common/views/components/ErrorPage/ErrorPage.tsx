import { FunctionComponent } from 'react';
import { headerBackgroundLs } from '../../../utils/backgrounds';
import { classNames } from '../../../utils/classnames';
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
      siteSection={null}
      image={undefined}
      hideNewsletterPromo={true}
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
        <div
          className={classNames({
            'bg-cream': false,
          })}
        >
          <SpacingSection>
            <SpacingComponent>
              {statusCode === 404 ? (
                <NotFoundErrorText />
              ) : (
                <DefaultErrorText />
              )}
            </SpacingComponent>
          </SpacingSection>
        </div>
      </Space>
    </PageLayout>
  );
};

export default ErrorPage;
