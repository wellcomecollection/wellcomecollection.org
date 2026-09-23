import { modeIsAtLeast, Modes } from './index';

describe('modeIsAtLeast', () => {
  const withPhase = (phase: string | null) =>
    ({ thematicBrowsing: phase }) as Partial<Modes>;

  it('is true at or beyond the target', () => {
    expect(
      modeIsAtLeast(
        withPhase('categoryPages'),
        'thematicBrowsing',
        'categoryPages'
      )
    ).toBe(true);
    expect(
      modeIsAtLeast(
        withPhase('subCategoryPages'),
        'thematicBrowsing',
        'categoryPages'
      )
    ).toBe(true);
  });

  it('is false before the target', () => {
    expect(
      modeIsAtLeast(
        withPhase('categoryPages'),
        'thematicBrowsing',
        'subCategoryPages'
      )
    ).toBe(false);
  });

  it('is false when nothing is selected, stale, or unpublished', () => {
    expect(
      modeIsAtLeast(withPhase(null), 'thematicBrowsing', 'categoryPages')
    ).toBe(false);
    expect(
      modeIsAtLeast(withPhase('removed'), 'thematicBrowsing', 'categoryPages')
    ).toBe(false);
    expect(modeIsAtLeast({}, 'thematicBrowsing', 'categoryPages')).toBe(false);
  });
});
