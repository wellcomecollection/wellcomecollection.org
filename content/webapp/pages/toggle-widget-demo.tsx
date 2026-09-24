import { GetServerSideProps, NextPage } from 'next';

import { defaultServerData, ServerData } from '@weco/common/server-data/types';
import ToggleWidget from '@weco/common/views/components/ToggleWidget';

// Throwaway - verifies ToggleWidget renders/behaves correctly for all four
// toggle kinds (feature flag, mode, A/B test, phased flag) without needing
// real starred toggles deployed to toggles.json. Delete once verified.

type Props = { serverData: ServerData };

const MOCK_TOGGLES_JSON = {
  featureFlags: [
    {
      id: 'demoFeatureFlag',
      title: 'Demo feature flag',
      defaultValue: false,
      description: 'A demo feature flag.',
      type: 'permanent',
    },
    {
      id: 'demoPublicFlag',
      title: 'Demo public flag',
      defaultValue: true,
      description: 'A demo feature flag that has gone public.',
      type: 'experimental',
    },
  ],
  phasedFlags: [],
  tests: [
    { id: 'demoAbTest', title: 'Demo A/B test', type: 'test', range: [0, 50] },
  ],
  modes: [
    {
      id: 'demoMode',
      title: 'Demo mode',
      description: 'A demo mode.',
      options: [
        { id: 'optionA', label: 'Option A' },
        { id: 'optionB', label: 'Option B' },
      ],
    },
  ],
};

const STARRED_IDS = [
  'demoFeatureFlag',
  'demoPublicFlag',
  'demoMode',
  'demoAbTest',
  'thematicBrowsingPhases',
];

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {
      serverData: {
        ...defaultServerData,
        toggles: {
          ...defaultServerData.toggles,
          featureFlags: {
            ...defaultServerData.toggles.featureFlags,
            demoFeatureFlag: false,
            demoPublicFlag: true,
          },
          modes: {
            ...defaultServerData.toggles.modes,
            demoMode: null,
          },
          // demoAbTest is deliberately absent - an unset A/B test reads as
          // undefined either way, but Next.js can't serialize `undefined`
          // as a getServerSideProps prop value, so the key can't be here.
          tests: defaultServerData.toggles.tests,
          phasedFlags: {
            thematicBrowsingPhases: {
              title: 'Thematic browsing',
              current: 'categoryPages',
              phases: [
                {
                  id: 'categoryPages',
                  label: 'Category pages',
                  description: '',
                },
                {
                  id: 'subCategoryPages',
                  label: 'Sub-category pages',
                  description: '',
                },
              ],
            },
          },
        },
      } as unknown as ServerData,
    },
  };
};

// Patched at module load, not in a useEffect - ToggleWidget's own effect
// (a child's) runs before this page's effect (its parent's) would, so
// patching fetch there would be too late to catch the widget's own call.
if (typeof window !== 'undefined') {
  document.cookie = `starred_toggles=${STARRED_IDS.join(',')}; path=/`;

  const realFetch = window.fetch;
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.includes('toggles.wellcomecollection.org/toggles.json')) {
      return Promise.resolve(
        new Response(JSON.stringify(MOCK_TOGGLES_JSON), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }
    return realFetch(input, init);
  }) as typeof window.fetch;
}

const ToggleWidgetDemoPage: NextPage<Props> = () => {
  return (
    <main style={{ height: '150vh', padding: 40 }}>
      <h1>Toggle widget demo</h1>
      <p>Scroll around, tab through, press Escape once open.</p>
      <ToggleWidget />
    </main>
  );
};

export default ToggleWidgetDemoPage;
