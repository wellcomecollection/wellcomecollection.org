import { getCookie, getCookies } from 'cookies-next';
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

const MESSAGE_TIMEOUT_MS = 20_000;

// Permanent flags useful to everyone, listed before the Digital team ones.
const GENERAL_FEATURE_FLAG_IDS = [
  'apiToolbar',
  'toggleWidget',
  'conceptsSearch',
];

const TogglesPage: FunctionComponent = () => {
  const router = useRouter();
  const {
    enableToggle,
    disableToggle,
    resetToggles,
    enableMode,
    disableMode,
    modeValue,
    phaseValue,
  } = router.query;
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
        // getCookie rather than cookies[...] - client-side getCookies()
        // returns raw values, but setCookie URL-encodes the commas, so a
        // multi-star list would come back as one unrecognised id and get
        // pruned to nothing.
        const parsedStarredIds = parseStarredToggles(
          getCookie(STARRED_TOGGLES_COOKIE)
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

  // Changes with each new message so the timer line on it starts over
  const [messageKey, setMessageKey] = useState(0);
  useEffect(() => {
    setMessageKey(key => key + 1);
  }, [message]);

  // Messages float, so clear them after a while. Errors stay until
  // dismissed - e.g. a failed load would otherwise leave a blank page.
  useEffect(() => {
    if (!message || message.isError) return;
    const timeout = setTimeout(() => setMessage(null), MESSAGE_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [message]);

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

  const handlePhasedFlag = useCallback(
    (flagId: string, action: 'enable' | 'disable', phaseId?: string) => {
      const flag = phasedFlags.find(f => f.id === flagId);
      if (!flag) {
        setMessage({
          text: `Phased flag "${flagId}" does not exist.`,
          isError: true,
        });
        return;
      }
      if (action === 'disable') {
        deleteCookieCustom(flagId);
        setPhasedFlagStates(prev => {
          const next = { ...prev };
          delete next[flagId];
          return next;
        });
        setMessage({
          text: `Phased flag "${flag.title}" has been reset to its default view.`,
          isError: false,
          isEnabled: false,
        });
        return;
      }
      if (!phaseId) {
        setMessage({
          text: `Phased flag "${flagId}" requires a phaseValue.`,
          isError: true,
        });
        return;
      }
      const phase = flag.phases.find(p => p.id === phaseId);
      if (!phase) {
        setMessage({
          text: `Phased flag "${flagId}" has no phase "${phaseId}".`,
          isError: true,
        });
        return;
      }
      setCookieCustom(flagId, phaseId);
      setPhasedFlagStates(prev => ({ ...prev, [flagId]: phaseId }));
      setMessage({
        text: `Phased flag "${flag.title}" has been set to "${phase.label}".`,
        isError: false,
        isEnabled: true,
      });
    },
    [phasedFlags]
  );

  const handleAbTest = useCallback(
    (testId: string, action: 'enable' | 'disable') => {
      const test = abTests.find(t => t.id === testId);
      if (!test) {
        setMessage({
          text: `A/B test "${testId}" does not exist.`,
          isError: true,
        });
        return;
      }
      if (action === 'enable') {
        setCookieCustom(testId, 'true');
        setToggleStates(prev => ({ ...prev, [testId]: true }));
        setMessage({
          text: `You're now in A/B test "${test.title}".`,
          isError: false,
          isEnabled: true,
        });
      } else {
        deleteCookieCustom(testId);
        setToggleStates(prev => ({ ...prev, [testId]: undefined }));
        setMessage({
          text: `A/B test "${test.title}" has been reset to random allocation.`,
          isError: false,
          isEnabled: false,
        });
      }
    },
    [abTests]
  );

  const handleModeReset = useCallback(
    (modeId: string) => {
      const mode = modes.find(m => m.id === modeId);
      if (!mode) {
        setMessage({
          text: `Mode "${modeId}" does not exist.`,
          isError: true,
        });
        return;
      }
      deleteCookieCustom(modeId);
      setModeStates(prev => {
        const next = { ...prev };
        delete next[modeId];
        return next;
      });
      setMessage({
        text: `Mode "${mode.title}" has been reset.`,
        isError: false,
        isEnabled: false,
      });
    },
    [modes]
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

  const resetFlagGroup = useCallback(
    (flags: FeatureFlag[], groupTitle: string) => {
      setToggleStates(prev => {
        const next = { ...prev };
        for (const { id, defaultValue } of flags) {
          deleteCookieCustom(id);
          next[id] = defaultValue;
        }
        return next;
      });
      setMessage({
        text: `${groupTitle} flags have been reset to their default values.`,
        isError: false,
      });
    },
    []
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

  const resetPhasedFlags = useCallback(() => {
    phasedFlags.forEach(flag => deleteCookieCustom(flag.id));
    setPhasedFlagStates({});
    setMessage({
      text: 'All phased flags have been reset to their public phase.',
      isError: false,
    });
  }, [phasedFlags]);

  const resetModes = useCallback(() => {
    modes.forEach(mode => deleteCookieCustom(mode.id));
    setModeStates({});
    setMessage({
      text: 'All modes have been reset.',
      isError: false,
    });
  }, [modes]);

  const resetEverything = useCallback(() => {
    reset();
    resetAbTests();
    resetPhasedFlags();
    resetModes();
    setMessage({
      text: 'Everything has been reset to its default.',
      isError: false,
    });
  }, [reset, resetAbTests, resetPhasedFlags, resetModes]);

  useEffect(() => {
    if (
      featureFlags.length === 0 &&
      phasedFlags.length === 0 &&
      modes.length === 0
    )
      return;

    const isKnownFeatureFlag = (id: string) =>
      featureFlags.some(f => f.id === id);
    const isKnownPhasedFlag = (id: string) =>
      phasedFlags.some(f => f.id === id);
    const isKnownAbTest = (id: string) => abTests.some(t => t.id === id);

    if (resetToggles !== undefined) {
      resetEverything();
    } else if (enableToggle) {
      const id = enableToggle as string;
      if (isKnownFeatureFlag(id)) {
        handleFeatureFlag(id, 'enable');
      } else if (isKnownPhasedFlag(id)) {
        handlePhasedFlag(id, 'enable', phaseValue as string | undefined);
      } else if (isKnownAbTest(id)) {
        handleAbTest(id, 'enable');
      } else {
        setMessage({ text: `Toggle "${id}" does not exist.`, isError: true });
      }
    } else if (disableToggle) {
      const id = disableToggle as string;
      if (isKnownFeatureFlag(id)) {
        handleFeatureFlag(id, 'disable');
      } else if (isKnownPhasedFlag(id)) {
        handlePhasedFlag(id, 'disable');
      } else if (isKnownAbTest(id)) {
        handleAbTest(id, 'disable');
      } else {
        setMessage({ text: `Toggle "${id}" does not exist.`, isError: true });
      }
    } else if (enableMode) {
      handleMode(enableMode as string, (modeValue as string) ?? '');
    } else if (disableMode) {
      handleModeReset(disableMode as string);
    }
  }, [
    enableToggle,
    disableToggle,
    resetToggles,
    enableMode,
    disableMode,
    modeValue,
    phaseValue,
    handleFeatureFlag,
    handlePhasedFlag,
    handleAbTest,
    handleMode,
    handleModeReset,
    resetEverything,
    featureFlags,
    phasedFlags,
    abTests,
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
    featureFlags
      .filter(t => GENERAL_FEATURE_FLAG_IDS.includes(t.id))
      // Order by this list rather than by toggles.json's own feature flag
      // order, so it doesn't depend on that order matching too (and isn't
      // at the mercy of toggles.json actually being deployed up to date).
      .sort(
        (a, b) =>
          GENERAL_FEATURE_FLAG_IDS.indexOf(a.id) -
          GENERAL_FEATURE_FLAG_IDS.indexOf(b.id)
      )
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

  const hasPermanent =
    generalFeatureFlags.length > 0 || permanentFeatureFlags.length > 0;
  const hasWorkInProgress =
    experimentalFeatureFlags.length > 0 ||
    stageFeatureFlags.length > 0 ||
    filteredPhasedFlags.length > 0 ||
    filteredAbTests.length > 0;

  const totalResults =
    generalFeatureFlags.length +
    permanentFeatureFlags.length +
    experimentalFeatureFlags.length +
    stageFeatureFlags.length +
    filteredPhasedFlags.length +
    filteredAbTests.length +
    filteredModes.length;

  // Starring is only useful once you can actually see the widget it feeds -
  // toggleStates reflects this user's own cookie override, or the public
  // default if they haven't set one.
  const toggleWidgetEnabled = toggleStates['toggleWidget'] ?? false;

  const hasOverrides =
    featureFlags.some(flag => toggleStates[flag.id] !== flag.defaultValue) ||
    abTests.some(test => toggleStates[test.id] !== undefined) ||
    Object.keys(phasedFlagStates).length > 0 ||
    Object.keys(modeStates).length > 0;

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
