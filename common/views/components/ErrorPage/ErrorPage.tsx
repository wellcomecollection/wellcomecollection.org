import { Fragment, FunctionComponent, useState, useEffect } from 'react';

// Helpers/Utils
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { getCookies } from 'cookies-next';
import styled from 'styled-components';

// Hard-coded values
import {
  DefaultErrorText,
  NotFoundErrorText,
  errorMessages,
} from '../../../data/errors';
import { headerBackgroundLs } from '../../../utils/backgrounds';
import { underConstruction } from '../../../icons';

// Components
import Icon from '../Icon/Icon';
import Layout8 from '../Layout8/Layout8';
import PageHeader, { headerSpaceSize } from '../PageHeader/PageHeader';
import PageLayout from '../PageLayout/PageLayout';
import SpacingSection from '../styled/SpacingSection';
import SpacingComponent from '../styled/SpacingComponent';
import Space from '../styled/Space';
import { dangerouslyGetEnabledToggles } from '@weco/common/utils/cookies';

const ToggleMessageBar = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
})`
  background: ${props => props.theme.color('yellow')};
  display: flex;
  align-items: center;
  position: relative;

  .icon {
    transform: translateY(0.1em);
  }
`;

/** This shows the user a list of toggles they currently have enabled, e.g.
 *
 *      You have the following toggles enabled: apiToolbar, stagingApi
 *
 * Sometimes toggles may cause errors on the site which aren't visible to
 * the public (e.g. the staging API toggle).
 *
 * Staff send us screenshots to show us the site is broken, and it may not
 * be immediately obvious why we can't reproduce the error.  This gives us
 * more information to help debug errors quickly.
 *
 * The only people who should have toggles enabled are Wellcome staff, and
 * this message only shows if you've enabled at least one toggle, so this
 * won't going to cause confusing messages to be shown to the public.
 *
 * We add a brightly coloured background to emphasise this isn't part of the
 * regular error page.
 */
const TogglesMessage: FunctionComponent = () => {
  // Note: we use this slightly non-standard construction rather than
  // useToggles() because we don't have access to the server data context
  // here -- we can't use getServerSideProps on an error page.
  // See https://nextjs.org/docs/messages/404-get-initial-props
  const [toggles, setToggles] = useState<string[]>([]);

  useEffect(() => {
    setToggles(
      // dangerouslyGetEnabledToggles returns a list with of all toggle cookies that are set.
      // Those prefixed with a ! have a false value and we only need to show the toggles with a value of true here
      dangerouslyGetEnabledToggles(getCookies()).filter(v => !v.startsWith('!'))
    );
  }, []);

  return toggles.length > 0 ? (
    <Layout8>
      <ToggleMessageBar>
        <Space h={{ size: 's', properties: ['margin-right'] }}>
          <Icon icon={underConstruction} />
        </Space>
        <Space h={{ size: 's', properties: ['margin-right'] }}>
          You have the following{' '}
          <a href="https://dash.wellcomecollection.org/toggles">toggles</a>{' '}
          enabled:{' '}
          {toggles.map((t, i) => (
            <Fragment key={t}>
              <strong>{t}</strong>
              {i !== toggles.length - 1 && <>, </>}
            </Fragment>
          ))}
        </Space>
      </ToggleMessageBar>
    </Layout8>
  ) : null;
};

type Props = {
  statusCode?: number;
  title?: string;
};

const ErrorPage: FunctionComponent<Props> = ({ statusCode = 500, title }) => {
  const errorMessage = isNotUndefined(title)
    ? title
    : statusCode in errorMessages
    ? errorMessages[statusCode]
    : errorMessages[500];

  return (
    <PageLayout
      title={`${statusCode}`}
      description={`${statusCode}`}
      url={{ pathname: '/' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      hideNewsletterPromo={true}
      siteSection={null}
    >
      <Space v={{ size: headerSpaceSize, properties: ['padding-bottom'] }}>
        <PageHeader
          breadcrumbs={{ items: [] }}
          labels={undefined}
          title={errorMessage}
          backgroundTexture={headerBackgroundLs}
          highlightHeading={true}
        />
        <SpacingSection>
          <SpacingComponent>
            {statusCode === 404 ? <NotFoundErrorText /> : <DefaultErrorText />}
            <TogglesMessage />
          </SpacingComponent>
        </SpacingSection>
      </Space>
    </PageLayout>
  );
};

export default ErrorPage;
