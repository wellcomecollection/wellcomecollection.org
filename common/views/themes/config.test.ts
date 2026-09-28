import { createTheme } from './config';

const legacy = createTheme(false);
const brand = createTheme(true);

describe('color', () => {
  it('resolves a current-brand colour name in both palettes', () => {
    expect(legacy.color('neutral.400')).toBe('#d9d9d9');
    // Its nearest design system equivalent, see colorToDesignSystemColor
    expect(brand.color('neutral.400')).toBe('#D2D6D0');
  });

  it('passes through values that have no palette equivalent', () => {
    expect(legacy.color('transparent')).toBe('transparent');
    expect(brand.color('transparent')).toBe('transparent');
  });

  describe('when a design system colour is pinned', () => {
    const pinned = { brand: 'orange.30', legacy: 'neutral.400' } as const;

    it('renders the pinned colour in the current brand', () => {
      expect(legacy.color(pinned)).toBe('#d9d9d9');
    });

    it('renders the design system colour in the new brand', () => {
      expect(brand.color(pinned)).toBe('#FFB691');
    });

    it('works for a name that both palettes use', () => {
      const white = { brand: 'white', legacy: 'neutral.400' } as const;

      expect(legacy.color(white)).toBe('#d9d9d9');
      expect(brand.color(white)).toBe('#FFFFFF');
    });

    it('can pin a value CSS resolves itself', () => {
      const transparent = {
        brand: 'orange.30',
        legacy: 'transparent',
      } as const;

      expect(legacy.color(transparent)).toBe('transparent');
      expect(brand.color(transparent)).toBe('#FFB691');
    });

    it('cannot be named without a pin', () => {
      // @ts-expect-error a design system colour needs the current-brand colour
      // to render in its place while the toggle is off
      legacy.color('orange.30');
      // @ts-expect-error `brand` has to be a design system colour
      legacy.color({ brand: 'neutral.400', legacy: 'neutral.400' });
      // @ts-expect-error `legacy` has to be one the current brand has
      legacy.color({ brand: 'orange.30', legacy: 'indigo.60' });
    });

    it('lets two call sites sharing a current-brand colour diverge', () => {
      const one = { brand: 'orange.30', legacy: 'neutral.400' } as const;
      const two = { brand: 'indigo.60', legacy: 'neutral.400' } as const;

      expect(legacy.color(one)).toBe(legacy.color(two));
      expect(brand.color(one)).not.toBe(brand.color(two));
    });
  });
});
