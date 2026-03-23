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

import ListOfToggles from './ListOfToggles';
import ABTests, { AbTest } from './toggles.ABTests';
import {
  deleteCookieCustom,
  setCookieCustom,
  Toggle,
  ToggleStates,
} from './toggles.helpers';
import {
  MessageBox,
  ResetButton,
  SearchInput,
  Section,
  SectionInner,
} from './toggles.styles';

const GENERAL_TOGGLE_IDS = ['apiToolbar', 'conceptsSearch'];

const TogglesPage: FunctionComponent = () => {
  const router = useRouter();
  const { enableToggle, disableToggle, resetToggles } = router.query;
  const [message, setMessage] = useState<{
    text: string;
    isError?: boolean;
    isEnabled?: boolean;
  } | null>(null);
  const [toggleStates, setToggleStates] = useState<ToggleStates>({});
  const [toggles, setToggles] = useState<Toggle[]>([]);
  const [abTests, setAbTests] = useState<AbTest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://toggles.wellcomecollection.org/toggles.json')
      .then(resp => resp.json())
      .then(json => {
        setToggles(json.toggles);
        setAbTests(json.tests);

        const cookies = getCookies();
        const initialStates: ToggleStates = {};

        // Toggles: cookie value or default
        for (const toggle of json.toggles as Toggle[]) {
          const cookieKey = `toggle_${toggle.id}`;
          initialStates[toggle.id] =
            cookieKey in cookies
              ? cookies[cookieKey] === 'true'
              : toggle.defaultValue;
        }

        // AB tests: cookie value or undefined (= randomly allocate)
        for (const test of json.tests as AbTest[]) {
          const cookieKey = `toggle_${test.id}`;
          if (cookieKey in cookies) {
            initialStates[test.id] = cookies[cookieKey] === 'true';
          }
        }

        setToggleStates(initialStates);
      })
      .catch(() =>
        setMessage({
          text: 'Failed to load toggles. Please try refreshing.',
          isError: true,
        })
      );
  }, []);

  const handleToggle = useCallback(
    (toggleId: string, action: 'enable' | 'disable') => {
      const toggleExists = toggles.some(toggle => toggle.id === toggleId);
      if (toggleExists) {
        if (action === 'enable') {
          setCookieCustom(toggleId, 'true');
          setToggleStates(prev => ({
            ...prev,
            [toggleId]: true,
          }));
          setMessage({
            text: `✅ Toggle "${toggleId}" has been successfully enabled!`,
            isError: false,
            isEnabled: true,
          });
        } else {
          const toggle = toggles.find(t => t.id === toggleId);
          deleteCookieCustom(toggleId);
          setToggleStates(prev => ({
            ...prev,
            [toggleId]: toggle?.defaultValue ?? false,
          }));
          setMessage({
            text: `🔵 Toggle "${toggleId}" has been reset to its default value.`,
            isError: false,
            isEnabled: false,
          });
        }
      } else {
        setMessage({
          text: `❌ Toggle "${toggleId}" does not exist.`,
          isError: true,
        });
      }
    },
    [toggles]
  );

  const reset = useCallback(
    () =>
      setToggleStates(prev => {
        const next = { ...prev };
        for (const { id, defaultValue } of toggles) {
          deleteCookieCustom(id);
          next[id] = defaultValue;
        }
        return next;
      }),
    [toggles]
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
    if (toggles.length === 0) return;

    if (resetToggles !== undefined) {
      reset();
      setMessage({
        text: '🔄 All toggles have been reset to their default values.',
        isError: false,
      });
    } else if (enableToggle) {
      handleToggle(enableToggle as string, 'enable');
    } else if (disableToggle) {
      handleToggle(disableToggle as string, 'disable');
    }
  }, [enableToggle, disableToggle, resetToggles, handleToggle, reset, toggles]);

  const filterToggles = (toggleList: Toggle[]) => {
    if (!searchQuery) return toggleList;
    const query = searchQuery.toLowerCase();
    return toggleList.filter(
      t =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query)
    );
  };

  const generalToggles = filterToggles(
    toggles.filter(t => GENERAL_TOGGLE_IDS.includes(t.id))
  );
  const restOfPermanentToggles = filterToggles(
    toggles
      .filter(t => t.type === 'permanent')
      .filter(t => !GENERAL_TOGGLE_IDS.includes(t.id))
  );
  const experimentalToggles = filterToggles(
    toggles.filter(t => t.type === 'experimental')
  );
  const stageToggles = filterToggles(toggles.filter(t => t.type === 'stage'));
  const filteredAbTests: AbTest[] = searchQuery
    ? abTests.filter(
        t =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : abTests;

  const totalResults =
    generalToggles.length +
    restOfPermanentToggles.length +
    experimentalToggles.length +
    stageToggles.length +
    filteredAbTests.length;

  return (
    <>
      <Head>
        <title>Toggles dashboard</title>
      </Head>
      <Header activePath="/toggles" />
      <PageContainer>
        <PageHeader>
          <PageTitle>Feature Toggles</PageTitle>
          <PageDescription>
            Manage and test feature flags; changes only affect your own browser.
            Toggles also have a public status which is set for 100% of users,
            which is done through devs running a script.
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
            <ResetButton
              onClick={() => {
                reset();
                setMessage({
                  text: '🔄 All toggles have been reset to their default values.',
                  isError: false,
                });
              }}
              aria-label="Reset all feature toggles to default values"
            >
              Reset toggles to defaults
            </ResetButton>
          </div>
        </main>
      </PageContainer>

      {(generalToggles.length > 0 || !searchQuery) && (
        <Section $background="default" $hasNoTopPadding>
          <SectionInner>
            <h2>Toggles for general use</h2>
            <ListOfToggles
              toggles={generalToggles}
              toggleStates={toggleStates}
              setToggleStates={setToggleStates}
            />
          </SectionInner>
        </Section>
      )}

      {(restOfPermanentToggles.length > 0 || !searchQuery) && (
        <Section $background="light">
          <SectionInner>
            <h2>Toggles for Digital team - Permanent</h2>
            <ListOfToggles
              toggles={restOfPermanentToggles}
              toggleStates={toggleStates}
              setToggleStates={setToggleStates}
            />
          </SectionInner>
        </Section>
      )}

      {(experimentalToggles.length > 0 || !searchQuery) && (
        <Section $background="alt">
          <SectionInner>
            <h2>Toggles for Digital team - Work in progress</h2>
            <ListOfToggles
              toggles={experimentalToggles}
              toggleStates={toggleStates}
              setToggleStates={setToggleStates}
            />
          </SectionInner>
        </Section>
      )}

      {(stageToggles.length > 0 || !searchQuery) && (
        <Section $background="light">
          <SectionInner>
            <h2>Toggles for Digital team - Staging</h2>
            <ListOfToggles
              toggles={stageToggles}
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
    </>
  );
};

export default TogglesPage;
