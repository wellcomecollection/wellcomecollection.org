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
import { ModeDefinition } from '@weco/toggles';

import ListOfToggles from './ListOfToggles';
import ABTests, { AbTest } from './toggles.ABTests';
import {
  deleteCookieCustom,
  FeatureFlag,
  setCookieCustom,
  ToggleStates,
} from './toggles.helpers';
import Modes from './toggles.Modes';
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
  const { enableToggle, disableToggle, resetToggles } = router.query;
  const [message, setMessage] = useState<{
    text: string;
    isError?: boolean;
    isEnabled?: boolean;
  } | null>(null);
  const [toggleStates, setToggleStates] = useState<ToggleStates>({});
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [abTests, setAbTests] = useState<AbTest[]>([]);
  const [modes, setModes] = useState<ModeDefinition[]>([]);
  const [modeStates, setModeStates] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://toggles.wellcomecollection.org/toggles.json')
      .then(resp => resp.json())
      .then(json => {
        const flags: FeatureFlag[] = json.featureFlags ?? [];
        const tests: AbTest[] = json.tests ?? [];
        const modeDefinitions: ModeDefinition[] = json.modes ?? [];

        setFeatureFlags(flags);
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
            text: `✅ Feature flag "${toggleId}" has been successfully enabled!`,
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
            text: `🔵 Feature flag "${toggleId}" has been reset to its default value.`,
            isError: false,
            isEnabled: false,
          });
        }
      } else {
        setMessage({
          text: `❌ Feature flag "${toggleId}" does not exist.`,
          isError: true,
        });
      }
    },
    [featureFlags]
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
      text: '🔄 All A/B tests have been reset to random allocation.',
      isError: false,
    });
  }, [abTests]);

  useEffect(() => {
    if (featureFlags.length === 0) return;

    if (resetToggles !== undefined) {
      reset();
      setMessage({
        text: '🔄 All feature flags have been reset to their default values.',
        isError: false,
      });
    } else if (enableToggle) {
      handleFeatureFlag(enableToggle as string, 'enable');
    } else if (disableToggle) {
      handleFeatureFlag(disableToggle as string, 'disable');
    }
  }, [
    enableToggle,
    disableToggle,
    resetToggles,
    handleFeatureFlag,
    reset,
    featureFlags,
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
    filteredAbTests.length +
    filteredModes.length;

  return (
    <>
      <Head>
        <title>Toggles dashboard</title>
      </Head>
      <Header activePath="/toggles" />
      <PageContainer>
        <PageHeader>
          <PageTitle>Toggles</PageTitle>
          <PageDescription>
            Manage and test feature flags, A/B tests, and modes; changes only
            affect your own browser. Feature flags also have a public status
            which is set for 100% of users, which is done through devs running a
            script.
          </PageDescription>
        </PageHeader>

        <main id="main-content">
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
            <TableOfContentsList>
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
                <a href="#ab-tests">A/B tests</a>
              </li>
              <li>
                <a href="#modes">Modes</a>
              </li>
            </TableOfContentsList>
          </nav>

          <SearchInput
            type="search"
            placeholder="Search toggles by name, description, or ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search toggles"
          />

          {searchQuery && (
            <p
              style={{ color: tokens.colors.text.secondary }}
              role="status"
              aria-live="polite"
            >
              Found {pluralise(totalResults, 'result')}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {featureFlags.some(
              flag => toggleStates[flag.id] !== flag.defaultValue
            ) && (
              <ResetButton
                onClick={() => {
                  reset();
                  setMessage({
                    text: '🔄 All feature flags have been reset to their default values.',
                    isError: false,
                  });
                }}
                aria-label="Reset all feature flags to default values"
              >
                Reset feature flags to defaults
              </ResetButton>
            )}
          </div>
        </main>
      </PageContainer>

      {(generalFeatureFlags.length > 0 || !searchQuery) && (
        <Section $background="default" $hasNoTopPadding>
          <SectionInner>
            <ListOfToggles
              title="Feature flags for general use"
              anchorId="general"
              description="Permanent flags useful to all users."
              featureFlags={generalFeatureFlags}
              toggleStates={toggleStates}
              setToggleStates={setToggleStates}
            />
          </SectionInner>
        </Section>
      )}

      {(permanentFeatureFlags.length > 0 || !searchQuery) && (
        <Section $background="light">
          <SectionInner>
            <ListOfToggles
              title="Feature flags for Digital team - Permanent"
              anchorId="permanent"
              description="Long-lived flags that control established features."
              featureFlags={permanentFeatureFlags}
              toggleStates={toggleStates}
              setToggleStates={setToggleStates}
            />
          </SectionInner>
        </Section>
      )}

      {(experimentalFeatureFlags.length > 0 || !searchQuery) && (
        <Section $background="alt">
          <SectionInner>
            <ListOfToggles
              title="Feature flags for Digital team - Work in progress"
              anchorId="wip"
              description="Experimental flags for features currently in development."
              featureFlags={experimentalFeatureFlags}
              toggleStates={toggleStates}
              setToggleStates={setToggleStates}
            />
          </SectionInner>
        </Section>
      )}

      {(stageFeatureFlags.length > 0 || !searchQuery) && (
        <Section $background="light">
          <SectionInner>
            <ListOfToggles
              title="Feature flags for Digital team - Staging"
              anchorId="staging"
              description="These flags are only active on the staging environment (www-stage)."
              featureFlags={stageFeatureFlags}
              toggleStates={toggleStates}
              setToggleStates={setToggleStates}
            />
          </SectionInner>
        </Section>
      )}

      {(filteredAbTests.length > 0 || !searchQuery) && (
        <Section $background="alt">
          <SectionInner>
            <ABTests
              filteredAbTests={filteredAbTests}
              toggleStates={toggleStates}
              setToggleStates={setToggleStates}
              onReset={resetAbTests}
            />
          </SectionInner>
        </Section>
      )}

      {(filteredModes.length > 0 || !searchQuery) && (
        <Section $background="light">
          <SectionInner>
            <Modes
              modes={filteredModes}
              modeStates={modeStates}
              setModeStates={setModeStates}
              onReset={() => {
                modes.forEach(mode => deleteCookieCustom(mode.id));
                setModeStates({});
              }}
            />
          </SectionInner>
        </Section>
      )}
    </>
  );
};

export default TogglesPage;
