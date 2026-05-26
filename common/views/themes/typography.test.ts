import { theme as designSystemTheme } from '@wellcometrust/wellcome-design-system/theme';

import { compositeTypographyMixin } from './typography';

const toCSS = (result: ReturnType<typeof compositeTypographyMixin>): string =>
  (result as unknown[]).flat().join('');

describe('compositeTypographyMixin', () => {
  test('returns correct styles for a non-heading category', () => {
    const expected = designSystemTheme.typography.body.regular.md;
    const result = toCSS(compositeTypographyMixin('body', 'md', 'regular'));

    expect(result).toContain(expected?.fontFamily);
    expect(result).toContain(expected?.fontWeight);
    expect(result).toContain(expected?.fontSize);
    expect(result).toContain(expected?.lineHeight);
    expect(result).toContain(expected?.letterSpacing);
  });

  test('returns correct styles for heading with an explicit family', () => {
    const expected = designSystemTheme.typography.heading.brand.strong.xl;
    const result = toCSS(
      compositeTypographyMixin('heading', 'xl', 'strong', 'brand')
    );

    expect(result).toContain(expected?.fontFamily);
    expect(result).toContain(expected?.fontSize);
  });

  test('defaults heading family to sans when family is omitted', () => {
    const withDefault = toCSS(
      compositeTypographyMixin('heading', 'md', 'strong')
    );
    const withExplicit = toCSS(
      compositeTypographyMixin('heading', 'md', 'strong', 'sans')
    );

    expect(withDefault).toEqual(withExplicit);
  });

  test('returns empty css for a combination that does not exist in the design system', () => {
    const warn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    // display only has 'strong', not 'regular'
    const result = toCSS(compositeTypographyMixin('display', 'md', 'regular'));

    expect(result.trim()).toBe('');
    warn.mockRestore();
  });

  test('warns when a combination does not exist in the design system', () => {
    const warn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    compositeTypographyMixin('display', 'md', 'regular');

    expect(warn).toHaveBeenCalledWith(
      'compositeTypographyMixin: no typography value found for "display.regular.md"'
    );

    warn.mockRestore();
  });
});
