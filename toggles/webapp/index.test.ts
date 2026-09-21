import { phaseIsAtLeast, ResolvedPhasedFlag } from './index';

describe('phaseIsAtLeast', () => {
  const phases: ResolvedPhasedFlag['phases'] = [
    { id: 'mvp', label: 'MVP', description: 'MVP phase' },
    { id: 'phase2', label: 'Phase 2', description: 'Phase 2' },
    { id: 'phase3', label: 'Phase 3', description: 'Phase 3' },
  ];

  it('is true when current equals target', () => {
    expect(phaseIsAtLeast({ current: 'phase2', phases }, 'phase2')).toBe(true);
  });

  it('is true when current is ahead of target', () => {
    expect(phaseIsAtLeast({ current: 'phase3', phases }, 'mvp')).toBe(true);
  });

  it('is false when current is behind target', () => {
    expect(phaseIsAtLeast({ current: 'mvp', phases }, 'phase2')).toBe(false);
  });

  it('is false when current is null (nothing public yet)', () => {
    expect(phaseIsAtLeast({ current: null, phases }, 'mvp')).toBe(false);
  });

  it('is false for a current value that matches no known phase', () => {
    // e.g. a stale cookie left over from a phase that's since been removed
    expect(phaseIsAtLeast({ current: 'longRemovedPhase', phases }, 'mvp')).toBe(
      false
    );
  });

  it('is false for a target that matches no known phase', () => {
    expect(phaseIsAtLeast({ current: 'phase3', phases }, 'notARealPhase')).toBe(
      false
    );
  });
});
