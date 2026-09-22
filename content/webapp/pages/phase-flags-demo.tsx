import { GetServerSideProps, NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { usePhasedFlags } from '@weco/common/server-data/Context';
import { ServerData } from '@weco/common/server-data/types';
import { phaseIsAtLeast } from '@weco/toggles';

// Not a real page - proves the phase-flag mechanism end to end against the
// real toggles pipeline (getServerSideProps -> serverData.toggles.phasedFlags
// -> usePhasedFlags() -> phaseIsAtLeast()). Safe to delete once it's served
// its purpose as a demo.

type Props = { serverData: ServerData };

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const serverData = await getServerData(context);
  return { props: { serverData } };
};

const cardStyle = (isActive: boolean): React.CSSProperties => ({
  flex: 1,
  padding: 16,
  borderRadius: 8,
  border: '1px solid #ccc',
  opacity: isActive ? 1 : 0.4,
  background: isActive ? '#e6f4f1' : '#f5f5f5',
});

const PhaseFlagsDemoPage: NextPage<Props> = () => {
  const phasedFlags = usePhasedFlags();
  const phasedFlagsDemo = phasedFlags.phasedFlagsDemo;

  if (!phasedFlagsDemo) {
    return (
      <main style={{ maxWidth: 640, margin: '40px auto', padding: '0 20px' }}>
        <p>
          <code>phasedFlagsDemo</code> hasn&apos;t resolved yet - the toggles
          cache refreshes every 60s after a deploy, so try reloading shortly.
        </p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 640,
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'sans-serif',
      }}
    >
      <h1>Phase flags demo</h1>
      <p>
        Current phase for <code>phasedFlagsDemo</code>:{' '}
        <strong>{phasedFlagsDemo.current ?? 'nothing public yet'}</strong>
      </p>
      <p>
        Add <code>?toggleOverride=phasedFlagsDemo:phase2</code> to this
        page&apos;s URL to preview a phase for this render only (no cookie set),
        or use the dashboard&apos;s &quot;Phased flags&quot; section to set a
        persistent one.
      </p>

      <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
        {phasedFlagsDemo.phases.map(phase => {
          const isActive = phaseIsAtLeast(phasedFlagsDemo, phase.id);
          return (
            <div key={phase.id} style={cardStyle(isActive)}>
              <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>{phase.label}</h2>
              <p style={{ margin: 0, fontSize: 14 }}>{phase.description}</p>
              <p style={{ margin: '8px 0 0', fontSize: 12, color: '#666' }}>
                {isActive ? 'Showing' : 'Not shown yet'}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default PhaseFlagsDemoPage;
