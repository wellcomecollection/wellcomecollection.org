import Head from 'next/head';
import { FunctionComponent, useEffect, useState } from 'react';

import { pluralise } from '@weco/dash/utils/formatting';
import Header from '@weco/dash/views/components/Header';
import {
  PageContainer,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@weco/dash/views/components/PageLayout';
import { tokens } from '@weco/dash/views/themes/tokens';

import {
  MESSAGE_TIMEOUT_MS,
  useFloatingMessage,
} from './hooks/useFloatingMessage';
import { useToggleActions } from './hooks/useToggleActions';
import { useTogglesData } from './hooks/useTogglesData';
import ListOfToggles from './ListOfToggles';
import ABTests from './toggles.ABTests';
import Modes from './toggles.Modes';
import PhasedFlags from './toggles.PhasedFlags';
import { ToggleStarProvider } from './toggles.StarContext';
import {
  MessageBox,
  MessageClose,
  MessageRegion,
  MessageTimer,
  ResetButton,
  SearchInput,
  Section,
  SectionHeading,
  SectionInner,
  TableOfContentsList,
  TableOfContentsSublist,
} from './toggles.styles';
import { filterToggles } from './utils/filterToggles';

const TogglesPage: FunctionComponent = () => {
  const { message, setMessage, messageKey } = useFloatingMessage();
  const {
    featureFlags,
    phasedFlags,
    abTests,
    modes,
    toggleStates,
    setToggleStates,
    phasedFlagStates,
    setPhasedFlagStates,
    modeStates,
    setModeStates,
    starredIds,
    handleToggleStar,
  } = useTogglesData(setMessage);
  const {
    resetFlagGroup,
    resetAbTests,
    resetPhasedFlags,
    resetModes,
    resetEverything,
  } = useToggleActions({
    featureFlags,
    phasedFlags,
    abTests,
    modes,
    setToggleStates,
    setPhasedFlagStates,
    setModeStates,
    setMessage,
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to hash anchor after data loads (sections aren't in the DOM on first render)
  useEffect(() => {
    if (featureFlags.length === 0) return;
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView();
      }
    }
  }, [featureFlags]);

  const {
    generalFeatureFlags,
    permanentFeatureFlags,
    experimentalFeatureFlags,
    stageFeatureFlags,
    filteredPhasedFlags,
    filteredAbTests,
    filteredModes,
    hasPermanent,
    hasWorkInProgress,
    totalResults,
  } = filterToggles({ featureFlags, phasedFlags, abTests, modes }, searchQuery);

  // Starring is only useful once you can actually see the widget it feeds -
  // toggleStates reflects this user's own cookie override, or the public
  // default if they haven't set one.
  const toggleWidgetEnabled = toggleStates['toggleWidget'] ?? false;

  const hasOverrides =
    featureFlags.some(flag => toggleStates[flag.id] !== flag.defaultValue) ||
    abTests.some(test => toggleStates[test.id] !== undefined) ||
    Object.keys(phasedFlagStates).length > 0 ||
    Object.keys(modeStates).length > 0;

  return (
    <ToggleStarProvider
      value={{
        starredIds,
        onToggleStar: handleToggleStar,
        showStars: toggleWidgetEnabled,
      }}
    >
      <Head>
        <title>Toggles dashboard</title>
      </Head>
      <Header activePath="/toggles" />
      <main id="main-content">
        <PageContainer>
          <PageHeader>
            <PageTitle>Toggles</PageTitle>
            <PageDescription>
              Manage and test feature flags, A/B tests, and modes; changes only
              affect your own browser. Feature flags also have a public status
              which is set for 100% of users, which is done through devs running
              a script.
            </PageDescription>
          </PageHeader>

          <label
            htmlFor="toggles-search"
            style={{
              display: 'block',
              marginBottom: tokens.spacing.xs,
              fontWeight: 600,
            }}
          >
            Search toggles
          </label>
          <SearchInput
            id="toggles-search"
            type="search"
            placeholder="Search by name, description, or ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          <p
            style={{ color: tokens.colors.text.secondary }}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {searchQuery && `Found ${pluralise(totalResults, 'result')}`}
          </p>

          <nav aria-label="Table of contents">
            <TableOfContentsList role="list">
              <li>
                <a href="#permanent">Permanent</a>
                <TableOfContentsSublist role="list">
                  <li>
                    <a href="#general">General</a>
                  </li>
                  <li>
                    <a href="#digital-team">Digital team</a>
                  </li>
                </TableOfContentsSublist>
              </li>
              <li>
                <a href="#wip">Work in progress</a>
                <TableOfContentsSublist role="list">
                  <li>
                    <a href="#feature-flags">Feature flags</a>
                  </li>
                  <li>
                    <a href="#phased-flags">Phased flags</a>
                  </li>
                  <li>
                    <a href="#staging">Staging</a>
                  </li>
                  <li>
                    <a href="#ab-tests">A/B tests</a>
                  </li>
                </TableOfContentsSublist>
              </li>
              <li>
                <a href="#modes">Modes</a>
              </li>
            </TableOfContentsList>
          </nav>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {hasOverrides && (
              <ResetButton
                onClick={resetEverything}
                aria-label="Reset everything to defaults"
              >
                Reset everything to defaults
              </ResetButton>
            )}
          </div>
        </PageContainer>

        {(hasPermanent || !searchQuery) && (
          <Section
            $background={tokens.colors.background.paper}
            aria-labelledby="permanent"
          >
            <SectionInner>
              <SectionHeading id="permanent">
                <a href="#permanent">Permanent</a>
              </SectionHeading>
              <p style={{ marginTop: 0, color: tokens.colors.text.secondary }}>
                Long-lived flags that control established features.
              </p>

              {(generalFeatureFlags.length > 0 || !searchQuery) && (
                <ListOfToggles
                  title="General"
                  onReset={() => resetFlagGroup(generalFeatureFlags, 'General')}
                  anchorId="general"
                  description="Useful to all users."
                  featureFlags={generalFeatureFlags}
                  toggleStates={toggleStates}
                  setToggleStates={setToggleStates}
                />
              )}

              {(permanentFeatureFlags.length > 0 || !searchQuery) && (
                <ListOfToggles
                  title="Digital team"
                  onReset={() =>
                    resetFlagGroup(permanentFeatureFlags, 'Digital team')
                  }
                  anchorId="digital-team"
                  description="For the Digital team's own work."
                  featureFlags={permanentFeatureFlags}
                  toggleStates={toggleStates}
                  setToggleStates={setToggleStates}
                />
              )}
            </SectionInner>
          </Section>
        )}

        {(hasWorkInProgress || !searchQuery) && (
          <Section
            $background={tokens.colors.background.section}
            aria-labelledby="wip"
          >
            <SectionInner>
              <SectionHeading id="wip">
                <a href="#wip">Work in progress</a>
              </SectionHeading>
              <p style={{ marginTop: 0, color: tokens.colors.text.secondary }}>
                Everything still being built or tested, before it becomes
                permanent.
              </p>

              {(experimentalFeatureFlags.length > 0 || !searchQuery) && (
                <ListOfToggles
                  title="Feature flags"
                  onReset={() =>
                    resetFlagGroup(experimentalFeatureFlags, 'Feature')
                  }
                  anchorId="feature-flags"
                  description="Experimental flags for features currently in development."
                  featureFlags={experimentalFeatureFlags}
                  toggleStates={toggleStates}
                  setToggleStates={setToggleStates}
                />
              )}

              {(filteredPhasedFlags.length > 0 || !searchQuery) && (
                <PhasedFlags
                  phasedFlags={filteredPhasedFlags}
                  phasedFlagStates={phasedFlagStates}
                  setPhasedFlagStates={setPhasedFlagStates}
                  onReset={resetPhasedFlags}
                />
              )}

              {(stageFeatureFlags.length > 0 || !searchQuery) && (
                <ListOfToggles
                  title="Staging"
                  onReset={() => resetFlagGroup(stageFeatureFlags, 'Staging')}
                  anchorId="staging"
                  description="These flags are only active on the staging environment (www-stage)."
                  emptyMessage="No staging-only flags right now."
                  featureFlags={stageFeatureFlags}
                  toggleStates={toggleStates}
                  setToggleStates={setToggleStates}
                />
              )}

              {(filteredAbTests.length > 0 || !searchQuery) && (
                <ABTests
                  filteredAbTests={filteredAbTests}
                  toggleStates={toggleStates}
                  setToggleStates={setToggleStates}
                  onReset={resetAbTests}
                />
              )}
            </SectionInner>
          </Section>
        )}

        {(filteredModes.length > 0 || !searchQuery) && (
          <Section
            $background={tokens.colors.background.paper}
            aria-labelledby="modes"
          >
            <SectionInner>
              <Modes
                modes={filteredModes}
                modeStates={modeStates}
                setModeStates={setModeStates}
                onReset={resetModes}
              />
            </SectionInner>
          </Section>
        )}
      </main>

      <MessageRegion role="status" aria-live="polite">
        {message && (
          <MessageBox
            key={messageKey}
            $isError={message.isError}
            $isEnabled={message.isEnabled}
          >
            <span>{message.text}</span>
            <MessageClose
              onClick={() => setMessage(null)}
              aria-label="Dismiss message"
            >
              <span aria-hidden="true">×</span>
            </MessageClose>
            {!message.isError && (
              <MessageTimer
                $durationMs={MESSAGE_TIMEOUT_MS}
                aria-hidden="true"
              />
            )}
          </MessageBox>
        )}
      </MessageRegion>
    </ToggleStarProvider>
  );
};

export default TogglesPage;
