import { FunctionComponent, useState, useEffect } from 'react';
import { getCookies } from 'cookies-next';
import styled from 'styled-components';

import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  DefaultErrorText,
  GoneErrorText,
  NotFoundErrorText,
  errorMessages,
} from '@weco/common/data/errors';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { underConstruction } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon/Icon';
import PageHeader, { headerSpaceSize } from '../PageHeader/PageHeader';
import PageLayout from '../PageLayout/PageLayout';
import SpacingSection from '../styled/SpacingSection';
import SpacingComponent from '../styled/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import { dangerouslyGetEnabledToggles } from '@weco/common/utils/cookies';
import Layout, { gridSize8 } from '../Layout';
import togglesList from '@weco/toggles/toggles';

const MessageBar = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background: ${props => props.theme.color('yellow')};
  display: flex;
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
    setToggles(() => {
      // dangerouslyGetEnabledToggles returns a list with of all toggle cookies that are set.
      // Those prefixed with a ! have a false value and we only need to show the toggles with a value of true here
      const activeTogglesInBrowser = dangerouslyGetEnabledToggles(
        getCookies()
      ).filter(v => !v.startsWith('!'));

      // Get the readable name
      if (activeTogglesInBrowser.length > 0) {
        const allToggles = [...togglesList.toggles, ...togglesList.tests];
        const activeToggleNames = activeTogglesInBrowser
          .map(
            id =>
              Object.values(allToggles).find(toggle => toggle.id === id)?.title
          )
          .filter(f => f);
        return activeToggleNames as string[];
      } else {
        return [];
      }
    });
  }, []);

  return toggles.length > 0 ? (
    <Space $v={{ size: 'l', properties: ['margin-top'] }}>
      <Layout gridSizes={gridSize8()}>
        <MessageBar>
          <Space $h={{ size: 's', properties: ['margin-right'] }}>
            <Icon icon={underConstruction} />
          </Space>
          <Space $h={{ size: 's', properties: ['margin-right'] }}>
            You have the following toggles enabled:
            <ul>
              {toggles.map(t => (
                <li key={t}>
                  <strong>{t}</strong>
                </li>
              ))}
            </ul>
            This could be what is causing this page to error,{' '}
            <a href="https://dash.wellcomecollection.org/toggles">
              please try resetting your toggles
            </a>
            .
          </Space>
        </MessageBar>
      </Layout>
    </Space>
  ) : null;
};

const SafariPreviewMessage: FunctionComponent = () => {
  const [showPreviewSafariMessage, setShowPreviewSafariMessage] =
    useState(false);

  useEffect(() => {
    const isSafari =
      !navigator.userAgent.includes('Chrome') &&
      navigator.userAgent.includes('Safari');
    const isPreview = window.location.host.includes('preview.');

    setShowPreviewSafariMessage(isSafari && isPreview);
  }, []);

  return showPreviewSafariMessage ? (
    <Space $v={{ size: 'l', properties: ['margin-top'] }}>
      <Layout gridSizes={gridSize8()}>
        <MessageBar>
          <Space $h={{ size: 's', properties: ['margin-right'] }}>
            <Icon icon={underConstruction} />
          </Space>
          <Space $h={{ size: 's', properties: ['margin-right'] }}>
            Prismic previews do not work in Safari. Please use a different
            browser, or enable cross-site cookies.
          </Space>
        </MessageBar>
      </Layout>
    </Space>
  ) : null;
};

const getErrorMessage = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return <NotFoundErrorText />;
    case 410:
      return <GoneErrorText />;
    default:
      return <DefaultErrorText />;
  }
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
      title={String(statusCode)}
      description={String(statusCode)}
      url={{ pathname: '/' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      hideNewsletterPromo={true}
    >
      <Space $v={{ size: headerSpaceSize, properties: ['padding-bottom'] }}>
        <PageHeader
          breadcrumbs={{ items: [] }}
          labels={undefined}
          title={errorMessage}
          backgroundTexture={headerBackgroundLs}
          highlightHeading={true}
        />
        <SpacingSection>
          <SpacingComponent>
            <SafariPreviewMessage />
            <TogglesMessage />
            {getErrorMessage(statusCode)}
          </SpacingComponent>
        </SpacingSection>
      </Space>
    </PageLayout>
  );
};

export default ErrorPage;
