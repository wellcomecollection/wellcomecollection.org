import { getCookies } from 'cookies-next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { pluralise } from '@weco/dash/utils/formatting';
import Header from '@weco/dash/views/components/Header';
import {
  PageContainer,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@weco/dash/views/components/PageLayout';
import { tokens } from '@weco/dash/views/themes/tokens';
import { ModeDefinition, PublishedPhasedFlag } from '@weco/toggles';

import ListOfToggles from './ListOfToggles';
import ABTests, { AbTest } from './toggles.ABTests';
import {
  deleteCookieCustom,
  FeatureFlag,
  MAX_STARRED_TOGGLES,
  parseStarredToggles,
  setCookieCustom,
  setStarredToggles,
  STARRED_TOGGLES_COOKIE,
  ToggleStates,
} from './toggles.helpers';
import Modes from './toggles.Modes';
import PhasedFlags from './toggles.PhasedFlags';
import {
  MessageBox,
  ResetButton,
  SearchInput,
  Section,
  SectionInner,
  TableOfContentsList,
} from './toggles.styles';

const GENERAL_FEATURE_FLAG_IDS = ['apiToolbar', 'conceptsSearch'];

const TogglesPage: FunctionComponent = () => {
  const router = useRouter();
  const { enableToggle, disableToggle, resetToggles, enableMode, modeValue } =
    router.query;
  const [message, setMessage] = useState<{
    text: string;
    isError?: boolean;
    isEnabled?: boolean;
  } | null>(null);
  const [toggleStates, setToggleStates] = useState<ToggleStates>({});
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [phasedFlags, setPhasedFlags] = useState<PublishedPhasedFlag[]>([]);
  const [phasedFlagStates, setPhasedFlagStates] = useState<
    Record<string, string>
  >({});
  const [abTests, setAbTests] = useState<AbTest[]>([]);
  const [modes, setModes] = useState<ModeDefinition[]>([]);
  const [modeStates, setModeStates] = useState<Record<string, string>>({});
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://toggles.wellcomecollection.org/toggles.json')
      .then(resp => resp.json())
      .then(json => {
        const flags: FeatureFlag[] = json.featureFlags ?? [];
        const phasedFlagDefinitions: PublishedPhasedFlag[] =
          json.phasedFlags ?? [];
        const tests: AbTest[] = json.tests ?? [];
        const modeDefinitions: ModeDefinition[] = json.modes ?? [];

        setFeatureFlags(flags);
        setPhasedFlags(phasedFlagDefinitions);
        setAbTests(tests);
        setModes(modeDefinitions);

        const cookies = getCookies();
        const initialStates: ToggleStates = {};

        // Feature flags: cookie value or default
        for (const toggle of flags) {
          const cookieKey = `toggle_${toggle.id}`;
          initialStates[toggle.id] =
            cookieKey in cookies
              ? cookies[cookieKey] === 'true'
              : toggle.defaultValue;
        }

        // Phased flags: only record a state when the cookie is a phase that
        // still exists - same reasoning as modes below, but validated
        // against each flag's own phases list rather than one shared list.
        const initialPhasedFlagStates: Record<string, string> = {};
        for (const flag of phasedFlagDefinitions) {
          const cookieKey = `toggle_${flag.id}`;
          const cookieValue = cookies[cookieKey];
          if (
            cookieValue &&
            flag.phases.some(phase => phase.id === cookieValue)
          ) {
            initialPhasedFlagStates[flag.id] = cookieValue;
          }
        }
        setPhasedFlagStates(initialPhasedFlagStates);

        // AB tests: cookie value or undefined (= randomly allocate)
        for (const test of tests) {
          const cookieKey = `toggle_${test.id}`;
          if (cookieKey in cookies) {
            initialStates[test.id] = cookies[cookieKey] === 'true';
          }
        }

        // Modes: read plain string cookie values
        const initialModeStates: Record<string, string> = {};
        for (const mode of modeDefinitions) {
          const cookieKey = `toggle_${mode.id}`;
          const cookieValue = cookies[cookieKey];
          if (cookieValue && cookieValue.length > 0) {
            initialModeStates[mode.id] = cookieValue;
          }
        }
        setModeStates(initialModeStates);

        // Prune any starred id that no longer matches a real toggle (e.g.
        // one that's since been deleted) - otherwise it lingers in the
        // cookie forever, still counting toward the 6-item cap, with no
        // star button left anywhere to un-star it from.
        const validIds = new Set([
          ...flags.map(f => f.id),
          ...phasedFlagDefinitions.map(f => f.id),
          ...tests.map(t => t.id),
          ...modeDefinitions.map(m => m.id),
        ]);
        const parsedStarredIds = parseStarredToggles(
          cookies[STARRED_TOGGLES_COOKIE]
        );
        const prunedStarredIds = parsedStarredIds.filter(id =>
          validIds.has(id)
        );
        if (prunedStarredIds.length !== parsedStarredIds.length) {
          setStarredToggles(prunedStarredIds);
        }
        setStarredIds(prunedStarredIds);

        setToggleStates(initialStates);
      })
      .catch(() =>
        setMessage({
          text: 'Failed to load toggles. Please try refreshing.',
          isError: true,
        })
      );
  }, []);

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

  const handleFeatureFlag = useCallback(
    (toggleId: string, action: 'enable' | 'disable') => {
      const toggleExists = featureFlags.some(toggle => toggle.id === toggleId);
      if (toggleExists) {
        if (action === 'enable') {
          setCookieCustom(toggleId, 'true');
          setToggleStates(prev => ({
            ...prev,
            [toggleId]: true,
          }));
          setMessage({
            text: `Feature flag "${toggleId}" has been enabled.`,
            isError: false,
            isEnabled: true,
          });
        } else {
          const toggle = featureFlags.find(t => t.id === toggleId);
          deleteCookieCustom(toggleId);
          setToggleStates(prev => ({
            ...prev,
            [toggleId]: toggle?.defaultValue ?? false,
          }));
          setMessage({
            text: `Feature flag "${toggleId}" has been reset to its default value.`,
            isError: false,
            isEnabled: false,
          });
        }
      } else {
        setMessage({
          text: `Feature flag "${toggleId}" does not exist.`,
          isError: true,
        });
      }
    },
    [featureFlags]
  );

  const handleMode = useCallback(
    (modeId: string, optionId: string) => {
      const mode = modes.find(m => m.id === modeId);
      if (!mode) {
        setMessage({
          text: `Mode "${modeId}" does not exist.`,
          isError: true,
        });
        return;
      }
      if (!optionId) {
        setMessage({
          text: `Mode "${modeId}" requires a modeValue.`,
          isError: true,
        });
        return;
      }
      const option = mode.options.find(opt => opt.id === optionId);
      if (!option) {
        setMessage({
          text: `Mode "${modeId}" has no option "${optionId}".`,
          isError: true,
        });
        return;
      }
      setCookieCustom(modeId, optionId);
      setModeStates(prev => ({
        ...prev,
        [modeId]: optionId,
      }));
      setMessage({
        text: `Mode "${mode.title}" has been set to "${option.label}".`,
        isError: false,
        isEnabled: true,
      });
    },
    [modes]
  );

  const reset = useCallback(
    () =>
      setToggleStates(prev => {
        const next = { ...prev };
        for (const { id, defaultValue } of featureFlags) {
          deleteCookieCustom(id);
          next[id] = defaultValue;
        }
        return next;
      }),
    [featureFlags]
  );

  const resetAbTests = useCallback(() => {
    setToggleStates(prev => {
      const next = { ...prev };
      for (const { id } of abTests) {
        deleteCookieCustom(id);
        delete next[id];
      }
      return next;
    });
    setMessage({
      text: 'All A/B tests have been reset to random allocation.',
      isError: false,
    });
  }, [abTests]);

  useEffect(() => {
    if (featureFlags.length === 0 && modes.length === 0) return;

    if (resetToggles !== undefined) {
      reset();
      setMessage({
        text: 'All feature flags have been reset to their default values.',
        isError: false,
      });
    } else if (enableToggle) {
      handleFeatureFlag(enableToggle as string, 'enable');
    } else if (disableToggle) {
      handleFeatureFlag(disableToggle as string, 'disable');
    } else if (enableMode) {
      handleMode(enableMode as string, (modeValue as string) ?? '');
    }
  }, [
    enableToggle,
    disableToggle,
    resetToggles,
    enableMode,
    modeValue,
    handleFeatureFlag,
    handleMode,
    reset,
    featureFlags,
    modes,
  ]);

  const filterFeatureFlags = (flagList: FeatureFlag[]) => {
    if (!searchQuery) return flagList;
    const query = searchQuery.toLowerCase();
    return flagList.filter(
      t =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query)
    );
  };

  const generalFeatureFlags = filterFeatureFlags(
    featureFlags.filter(t => GENERAL_FEATURE_FLAG_IDS.includes(t.id))
  );
  const permanentFeatureFlags = filterFeatureFlags(
    featureFlags
      .filter(t => t.type === 'permanent')
      .filter(t => !GENERAL_FEATURE_FLAG_IDS.includes(t.id))
  );
  const experimentalFeatureFlags = filterFeatureFlags(
    featureFlags.filter(t => t.type === 'experimental')
  );
  const stageFeatureFlags = filterFeatureFlags(
    featureFlags.filter(t => t.type === 'stage')
  );
  const filteredPhasedFlags: PublishedPhasedFlag[] = searchQuery
    ? phasedFlags.filter(flag => {
        const query = searchQuery.toLowerCase();
        return (
          flag.title.toLowerCase().includes(query) ||
          flag.description.toLowerCase().includes(query) ||
          flag.id.toLowerCase().includes(query) ||
          flag.phases.some(
            phase =>
              phase.label.toLowerCase().includes(query) ||
              phase.description.toLowerCase().includes(query)
          )
        );
      })
    : phasedFlags;
  const filteredAbTests: AbTest[] = searchQuery
    ? abTests.filter(
        t =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : abTests;

  const filteredModes: ModeDefinition[] = searchQuery
    ? modes.filter(m => {
        const query = searchQuery.toLowerCase();
        return (
          m.title.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.id.toLowerCase().includes(query) ||
          m.options.some(opt => opt.label.toLowerCase().includes(query))
        );
      })
    : modes;

  const totalResults =
    generalFeatureFlags.length +
    permanentFeatureFlags.length +
    experimentalFeatureFlags.length +
    stageFeatureFlags.length +
    filteredPhasedFlags.length +
    filteredAbTests.length +
    filteredModes.length;

  const resetPhasedFlags = useCallback(() => {
    phasedFlags.forEach(flag => deleteCookieCustom(flag.id));
    setPhasedFlagStates({});
    setMessage({
      text: 'All phased flags have been reset to their public phase.',
      isError: false,
    });
  }, [phasedFlags]);

  // Starring is only useful once you can actually see the widget it feeds -
  // toggleStates reflects this user's own cookie override, or the public
  // default if they haven't set one.
  const toggleWidgetEnabled = toggleStates['toggleWidget'] ?? false;

  const handleToggleStar = useCallback((id: string) => {
    setStarredIds(prev => {
      const isRemoving = prev.includes(id);
      if (!isRemoving && prev.length >= MAX_STARRED_TOGGLES) return prev;

      const next = isRemoving
        ? prev.filter(starredId => starredId !== id)
        : [...prev, id];
      setStarredToggles(next);
      return next;
    });
  }, []);

  return (
    <>
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

          {message && (
            <MessageBox
              $isError={message.isError}
              $isEnabled={message.isEnabled}
              role="status"
              aria-live="polite"
            >
              {message.text}
            </MessageBox>
          )}

          <nav aria-label="Table of contents">
            <TableOfContentsList role="list">
              <li>
                <a href="#general">General</a>
              </li>
              <li>
                <a href="#permanent">Permanent</a>
              </li>
              <li>
                <a href="#wip">Work in progress</a>
              </li>
              <li>
                <a href="#staging">Staging</a>
              </li>
              <li>
                <a href="#phased-flags">Phased flags</a>
              </li>
              <li>
                <a href="#ab-tests">A/B tests</a>
              </li>
              <li>
                <a href="#modes">Modes</a>
              </li>
            </TableOfContentsList>
          </nav>

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

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {featureFlags.some(
              flag => toggleStates[flag.id] !== flag.defaultValue
            ) && (
              <ResetButton
                onClick={() => {
                  reset();
                  setMessage({
                    text: 'All feature flags have been reset to their default values.',
                    isError: false,
                  });
                }}
                aria-label="Reset all feature flags to default values"
              >
                Reset feature flags to defaults
              </ResetButton>
            )}
          </div>
        </PageContainer>

        {(generalFeatureFlags.length > 0 || !searchQuery) && (
          <Section
            $background="default"
            $hasNoTopPadding
            aria-labelledby="general"
          >
            <SectionInner>
              <ListOfToggles
                title="Feature flags for general use"
                anchorId="general"
                description="Permanent flags useful to all users."
                featureFlags={generalFeatureFlags}
                toggleStates={toggleStates}
                setToggleStates={setToggleStates}
                starredIds={starredIds}
                onToggleStar={handleToggleStar}
                showStars={toggleWidgetEnabled}
              />
            </SectionInner>
          </Section>
        )}

        {(permanentFeatureFlags.length > 0 || !searchQuery) && (
          <Section $background="light" aria-labelledby="permanent">
            <SectionInner>
              <ListOfToggles
                title="Feature flags for Digital team - Permanent"
                anchorId="permanent"
                description="Long-lived flags that control established features."
                featureFlags={permanentFeatureFlags}
                toggleStates={toggleStates}
                setToggleStates={setToggleStates}
                starredIds={starredIds}
                onToggleStar={handleToggleStar}
                showStars={toggleWidgetEnabled}
              />
            </SectionInner>
          </Section>
        )}

        {(experimentalFeatureFlags.length > 0 || !searchQuery) && (
          <Section $background="alt" aria-labelledby="wip">
            <SectionInner>
              <ListOfToggles
                title="Feature flags for Digital team - Work in progress"
                anchorId="wip"
                description="Experimental flags for features currently in development."
                featureFlags={experimentalFeatureFlags}
                toggleStates={toggleStates}
                setToggleStates={setToggleStates}
                starredIds={starredIds}
                onToggleStar={handleToggleStar}
                showStars={toggleWidgetEnabled}
              />
            </SectionInner>
          </Section>
        )}

        {(stageFeatureFlags.length > 0 || !searchQuery) && (
          <Section $background="light" aria-labelledby="staging">
            <SectionInner>
              <ListOfToggles
                title="Feature flags for Digital team - Staging"
                anchorId="staging"
                description="These flags are only active on the staging environment (www-stage)."
                featureFlags={stageFeatureFlags}
                toggleStates={toggleStates}
                setToggleStates={setToggleStates}
                starredIds={starredIds}
                onToggleStar={handleToggleStar}
                showStars={toggleWidgetEnabled}
              />
            </SectionInner>
          </Section>
        )}

        {(filteredPhasedFlags.length > 0 || !searchQuery) && (
          <Section $background="alt" aria-labelledby="phased-flags">
            <SectionInner>
              <PhasedFlags
                phasedFlags={filteredPhasedFlags}
                phasedFlagStates={phasedFlagStates}
                setPhasedFlagStates={setPhasedFlagStates}
                onReset={resetPhasedFlags}
                starredIds={starredIds}
                onToggleStar={handleToggleStar}
                showStars={toggleWidgetEnabled}
              />
            </SectionInner>
          </Section>
        )}

        {(filteredAbTests.length > 0 || !searchQuery) && (
          <Section $background="light" aria-labelledby="ab-tests">
            <SectionInner>
              <ABTests
                filteredAbTests={filteredAbTests}
                toggleStates={toggleStates}
                setToggleStates={setToggleStates}
                onReset={resetAbTests}
                starredIds={starredIds}
                onToggleStar={handleToggleStar}
                showStars={toggleWidgetEnabled}
              />
            </SectionInner>
          </Section>
        )}

        {(filteredModes.length > 0 || !searchQuery) && (
          <Section $background="alt" aria-labelledby="modes">
            <SectionInner>
              <Modes
                modes={filteredModes}
                modeStates={modeStates}
                setModeStates={setModeStates}
                onReset={() => {
                  modes.forEach(mode => deleteCookieCustom(mode.id));
                  setModeStates({});
                }}
                starredIds={starredIds}
                onToggleStar={handleToggleStar}
                showStars={toggleWidgetEnabled}
              />
            </SectionInner>
          </Section>
        )}
      </main>
    </>
  );
};

export default TogglesPage;
