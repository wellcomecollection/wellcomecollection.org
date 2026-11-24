import {
  mediaBackgroundColor,
  pageBackgroundColor,
  themeValues as theme,
} from './config';

describe('color', () => {
  it('resolves an alias to its design system colour', () => {
    expect(theme.color('neutral.400')).toBe(theme.color('neutral.20'));
    expect(theme.color('neutral.400')).toBe('#D2D6D0');
  });

  it('resolves a design system colour', () => {
    expect(theme.color('orange.30')).toBe('#FFB691');
  });

  it('passes through values CSS resolves itself', () => {
    expect(theme.color('transparent')).toBe('transparent');
    expect(theme.color('currentColor')).toBe('currentColor');
  });

  it('prefers the alias where a name is in both', () => {
    // `black` is the text colour, not the design system's black
    expect(theme.color('black')).toBe(theme.color('neutral.70'));
  });

  it('keeps the raw colours map in step with color()', () => {
    expect(theme.colors['focus.yellow']).toBe(theme.color('focus.yellow'));
  });

  it('rejects a name that is in neither', () => {
    // @ts-expect-error not a colour the theme knows
    theme.color('indigo.99');
  });
});

describe('shared colours', () => {
  it('gives the page its off-white background', () => {
    expect(theme.color(pageBackgroundColor)).toBe('#FAFBF7');
  });

  it('keeps media backdrops darker than the text colour', () => {
    expect(theme.color(mediaBackgroundColor)).toBe('#111A1C');
    expect(theme.color('black')).toBe('#223438');
  });
});
