import { GetServerSideProps, NextPage } from 'next';

import { defaultServerData, ServerData } from '@weco/common/server-data/types';
import PhaseSwitcher from '@weco/common/views/components/PhaseSwitcher';

// Throwaway - verifies PhaseSwitcher renders/behaves correctly without
// needing real flags deployed to toggles.json. Delete once verified.

type Props = { serverData: ServerData };

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {
      serverData: {
        ...defaultServerData,
        toggles: {
          ...defaultServerData.toggles,
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
            archiveCollectionPhases: {
              title: 'Archive collection',
              current: null,
              phases: [
                { id: 'mvp', label: 'MVP', description: '' },
                { id: 'phase2', label: 'Phase 2', description: '' },
              ],
            },
          },
        },
      },
    },
  };
};

const PhaseSwitcherDemoPage: NextPage<Props> = () => {
  return (
    <main style={{ height: '150vh', padding: 40 }}>
      <h1>Phase switcher demo</h1>
      <p>Scroll around, tab through, press Escape once open.</p>
      <PhaseSwitcher />
    </main>
  );
};

export default PhaseSwitcherDemoPage;
