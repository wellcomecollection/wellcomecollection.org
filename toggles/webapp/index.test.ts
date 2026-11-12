import {
  featureFlagCookieValue,
  personalFeatureFlagValue,
  personalPhaseValue,
  phaseIsAtLeast,
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
