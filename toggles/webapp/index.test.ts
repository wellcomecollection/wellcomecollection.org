import {
  featureFlagCookieValue,
  personalFeatureFlagValue,
  personalPhaseValue,
  phaseIsAtLeast,
  phaseLadder,
  ResolvedPhasedFlag,
} from './index';

describe('phaseIsAtLeast', () => {
  const title = 'Test flag';
  const phases: ResolvedPhasedFlag['phases'] = [
    { id: 'mvp', label: 'MVP', description: 'MVP phase' },
    { id: 'phase2', label: 'Phase 2', description: 'Phase 2' },
    { id: 'phase3', label: 'Phase 3', description: 'Phase 3' },
  ];

  it('is true when current equals target', () => {
    expect(phaseIsAtLeast({ title, current: 'phase2', phases }, 'phase2')).toBe(
      true
    );
  });

  it('is true when current is ahead of target', () => {
    expect(phaseIsAtLeast({ title, current: 'phase3', phases }, 'mvp')).toBe(
      true
    );
  });

  it('is false when current is behind target', () => {
    expect(phaseIsAtLeast({ title, current: 'mvp', phases }, 'phase2')).toBe(
      false
    );
  });

  it('is false when current is null (nothing public yet)', () => {
    expect(phaseIsAtLeast({ title, current: null, phases }, 'mvp')).toBe(false);
  });

  it('is false for a current value that matches no known phase', () => {
    // e.g. a stale cookie left over from a phase that's since been removed
    expect(
      phaseIsAtLeast({ title, current: 'longRemovedPhase', phases }, 'mvp')
    ).toBe(false);
  });

  it('is false for a target that matches no known phase', () => {
    expect(
      phaseIsAtLeast({ title, current: 'phase3', phases }, 'notARealPhase')
    ).toBe(false);
  });

  it('is false when the flag has not been published yet', () => {
    // e.g. usePhasedFlags() called before yarn deploy ran from toggles/webapp
    expect(phaseIsAtLeast(undefined, 'mvp')).toBe(false);
  });
});

describe('personalFeatureFlagValue', () => {
  it('reads "true" as on for every flag type', () => {
    expect(personalFeatureFlagValue({ type: 'experimental' }, 'true')).toBe(
      true
    );
    expect(personalFeatureFlagValue({ type: 'permanent' }, 'true')).toBe(true);
  });

  it('reads "off" as off for an experimental flag only', () => {
    expect(personalFeatureFlagValue({ type: 'experimental' }, 'off')).toBe(
      false
    );
    expect(
      personalFeatureFlagValue({ type: 'permanent' }, 'off')
    ).toBeUndefined();
    expect(personalFeatureFlagValue({ type: 'stage' }, 'off')).toBeUndefined();
  });

  it('treats "false", an unknown value or no cookie as no preference', () => {
    expect(
      personalFeatureFlagValue({ type: 'experimental' }, 'false')
    ).toBeUndefined();
    expect(
      personalFeatureFlagValue({ type: 'experimental' }, 'banana')
    ).toBeUndefined();
    expect(
      personalFeatureFlagValue({ type: 'experimental' }, undefined)
    ).toBeUndefined();
  });
});

describe('featureFlagCookieValue', () => {
  const internal = { type: 'experimental', defaultValue: false };
  const released = { type: 'experimental', defaultValue: true };

  it('keeps no cookie when the switch matches what everyone sees', () => {
    expect(featureFlagCookieValue(internal, false)).toBeUndefined();
    expect(featureFlagCookieValue(released, true)).toBeUndefined();
  });

  it('stores "true" to turn a flag on for yourself', () => {
    expect(featureFlagCookieValue(internal, true)).toBe('true');
  });

  it('stores "off" to turn an experimental flag off once it is public', () => {
    expect(featureFlagCookieValue(released, false)).toBe('off');
  });

  it('stores "false" for other flag types, which the site ignores', () => {
    expect(
      featureFlagCookieValue({ type: 'permanent', defaultValue: true }, false)
    ).toBe('false');
  });

  it('round-trips with personalFeatureFlagValue', () => {
    for (const flag of [internal, released]) {
      for (const isOn of [true, false]) {
        const stored = featureFlagCookieValue(flag, isOn);
        expect(
          personalFeatureFlagValue(flag, stored) ?? flag.defaultValue
        ).toBe(isOn);
      }
    }
  });
});

describe('personalPhaseValue', () => {
  const phases = [{ id: 'mvp' }, { id: 'phase2' }];
  const notPublic = { phases, defaultPhase: null };
  const public_ = { phases, defaultPhase: 'mvp' };

  it('picks a phase by its id, public or not', () => {
    expect(personalPhaseValue(notPublic, 'phase2')).toBe('phase2');
    expect(personalPhaseValue(public_, 'mvp')).toBe('mvp');
  });

  it('turns the flag off for you (null) once a phase is public', () => {
    expect(personalPhaseValue(public_, 'off')).toBeNull();
  });

  it('ignores "off" while nothing is public, as it would hold you on the old version after release', () => {
    expect(personalPhaseValue(notPublic, 'off')).toBeUndefined();
  });

  it('has no preference for anything else', () => {
    for (const value of [undefined, '', 'false', 'reset', 'phase9']) {
      expect(personalPhaseValue(public_, value)).toBeUndefined();
    }
  });
});

describe('phaseLadder', () => {
  const phases = [
    { id: 'mvp', label: 'Phase 1', description: 'First' },
    { id: 'phase2', label: 'Phase 2', description: 'Second' },
    { id: 'phase3', label: 'Phase 3', description: 'Third' },
  ];
  const summary = (steps: ReturnType<typeof phaseLadder>) =>
    steps.map(step => `${step.id}:${step.state}:${step.line ?? '-'}`);

  it('starts with Off once a phase is public', () => {
    const steps = phaseLadder({ phases, defaultPhase: 'mvp' }, undefined);

    expect(steps.map(step => step.id)).toEqual([
      'off',
      'mvp',
      'phase2',
      'phase3',
    ]);
    expect(steps[0].description).toBe('The version from before Phase 1');
  });

  it('has no Off step, and nothing chosen, while nothing is public and there is no choice', () => {
    const steps = phaseLadder({ phases, defaultPhase: null }, undefined);

    expect(steps.map(step => step.id)).toEqual(['mvp', 'phase2', 'phase3']);
    expect(steps.every(step => step.state === 'inactive')).toBe(true);
  });

  it('chooses the public step when there is no personal choice', () => {
    expect(
      summary(phaseLadder({ phases, defaultPhase: 'phase2' }, undefined))
    ).toEqual([
      'off:included:active',
      'mvp:included:active',
      'phase2:current:inactive',
      'phase3:inactive:-',
    ]);
  });

  it('chooses a personal phase, which can be before or after the public one', () => {
    const flag = { phases, defaultPhase: 'mvp' };

    expect(summary(phaseLadder(flag, 'phase3'))).toEqual([
      'off:included:active',
      'mvp:included:active',
      'phase2:included:active',
      'phase3:current:-',
    ]);
    expect(summary(phaseLadder(flag, 'mvp'))).toEqual([
      'off:included:active',
      'mvp:current:inactive',
      'phase2:inactive:inactive',
      'phase3:inactive:-',
    ]);
  });

  it('chooses Off for a personal off, with no step included and no line filled', () => {
    expect(summary(phaseLadder({ phases, defaultPhase: 'mvp' }, null))).toEqual(
      [
        'off:current:inactive',
        'mvp:inactive:inactive',
        'phase2:inactive:inactive',
        'phase3:inactive:-',
      ]
    );
  });
});
