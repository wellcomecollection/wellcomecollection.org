import { modeIsAtLeast, Modes } from './index';

// No phased mode is live yet, so test against a stand-in config.
jest.mock('./toggles', () => ({
  __esModule: true,
  default: {
    featureFlags: [],
    tests: [],
    modes: [
      {
        id: 'demo',
        phased: true,
        options: [{ id: 'mvp' }, { id: 'phase2' }],
      },
    ],
  },
}));

const isAtLeast = (current: string | null | undefined, target: string) =>
  modeIsAtLeast(
    { demo: current } as unknown as Partial<Modes>,
    'demo' as never,
    target as never
  );

describe('modeIsAtLeast', () => {
  it('is true at or beyond the target', () => {
    expect(isAtLeast('mvp', 'mvp')).toBe(true);
    expect(isAtLeast('phase2', 'mvp')).toBe(true);
  });

  it('is false before the target', () => {
    expect(isAtLeast('mvp', 'phase2')).toBe(false);
  });

  it('is false when nothing is selected, stale, or unpublished', () => {
    expect(isAtLeast(null, 'mvp')).toBe(false);
    expect(isAtLeast('removed', 'mvp')).toBe(false);
    expect(isAtLeast(undefined, 'mvp')).toBe(false);
  });
});
