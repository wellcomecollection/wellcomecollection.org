import { getCookies } from 'cookies-next';
import { NextPage } from 'next';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  DefaultErrorText,
  errorMessages,
  GoneErrorText,
  NotFoundErrorText,
} from '@weco/common/data/errors';
import { underConstruction } from '@weco/common/icons';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { dangerouslyGetEnabledToggles } from '@weco/common/utils/cookies';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import Icon from '@weco/common/views/components/Icon';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import { headerSpaceSize } from '@weco/common/views/components/PageHeader/PageHeader.styles';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import togglesList from '@weco/toggles/toggles';

const MessageBar = styled(Space).attrs({
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
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
 *      You have the following toggles enabled: apiToolbar, API environment (Stage)
 *
 * Sometimes toggles may cause errors on the site which aren't visible to
 * the public (e.g. the API environment mode set to Stage).
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
  // useFeatureFlags() because we don't have access to the server data context
  // here -- we can't use getServerSideProps on an error page.
  // See https://nextjs.org/docs/messages/404-get-initial-props
  const [toggles, setToggles] = useState<string[]>([]);
  const [hasActiveMode, setHasActiveMode] = useState(false);

  useEffect(() => {
    setToggles(() => {
      const cookies = getCookies();
      // dangerouslyGetEnabledToggles returns a list with of all toggle cookies that are set.
      // Those prefixed with a ! have a false value and we only need to show the toggles with a value of true here
      const activeTogglesInBrowser = dangerouslyGetEnabledToggles(
        cookies
      ).filter(v => !v.startsWith('!'));

      const activeModes = activeTogglesInBrowser.filter(id =>
        togglesList.modes.some(mode => mode.id === id)
      );

      setHasActiveMode(activeModes.length > 0);

      // Get the readable name - for a mode or phased flag, also show which
      // option/phase is selected (e.g. "API environment (Stage)"), since
      // knowing one is merely "on" isn't enough to debug from - unlike a
      // feature flag, their behaviour depends entirely on which was picked.
      if (activeTogglesInBrowser.length > 0) {
        const flattenedTogglesList = [
          ...togglesList.featureFlags,
          ...togglesList.tests,
          ...togglesList.modes,
          ...togglesList.phasedFlags,
        ];
        const activeToggleNames = activeTogglesInBrowser
          .map(id => {
            const toggle = Object.values(flattenedTogglesList).find(
              t => t.id === id
            );
            if (!toggle) return undefined;

            const mode = togglesList.modes.find(m => m.id === id);
            const phasedFlag = togglesList.phasedFlags.find(f => f.id === id);
            const options = mode?.options ?? phasedFlag?.phases;
            if (!options) return toggle.title;

            const optionValue = cookies[`toggle_${id}`];
            const option = options.find(o => o.id === optionValue);
            return `${toggle.title} (${option?.label ?? optionValue})`;
          })
          .filter(isNotUndefined);
        return activeToggleNames;
      } else {
        return [];
      }
    });
  }, []);

  return toggles.length > 0 ? (
    <Space $v={{ size: 'md', properties: ['margin-top'] }}>
      <ContaineredLayout gridSizes={gridSize8()}>
        <MessageBar>
          <Space $h={{ size: 'xs', properties: ['margin-right'] }}>
            <Icon icon={underConstruction} />
          </Space>
          <Space $h={{ size: 'xs', properties: ['margin-right'] }}>
            You have the following toggles enabled:
            <ul>
              {toggles.map(t => (
                <li key={t}>
                  <strong>{t}</strong>
                </li>
              ))}
            </ul>
            This could be what is causing this page to error,{' '}
            <a
              href="https://dash.wellcomecollection.org/toggles"
              target="_blank"
              rel="noopener noreferrer"
            >
              please try resetting your toggles
            </a>
            .
            {hasActiveMode && (
              <Space $v={{ size: 'xs', properties: ['margin-top'] }}>
                <strong>You are also not using the default view mode</strong>,
                which could be changing the default experience.{' '}
                <a
                  href="https://dash.wellcomecollection.org/toggles/#modes"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  You can reset them here
                </a>
                .
              </Space>
            )}
          </Space>
        </MessageBar>
      </ContaineredLayout>
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
    <Space $v={{ size: 'md', properties: ['margin-top'] }}>
      <ContaineredLayout gridSizes={gridSize8()}>
        <MessageBar>
          <Space $h={{ size: 'xs', properties: ['margin-right'] }}>
            <Icon icon={underConstruction} />
          </Space>
          <Space $h={{ size: 'xs', properties: ['margin-right'] }}>
            Prismic previews do not work in Safari. Please use a different
            browser, or enable cross-site cookies.
          </Space>
        </MessageBar>
      </ContaineredLayout>
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

const ErrorPage: NextPage<Props> = ({ statusCode = 500, title }) => {
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
      hideNewsletterPromo
    >
      <Space $v={{ size: headerSpaceSize, properties: ['padding-bottom'] }}>
        <PageHeader
          variant="basic"
          breadcrumbs={{ items: [] }}
          labels={undefined}
          title={errorMessage}
          backgroundTexture={headerBackgroundLs}
          highlightHeading
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
