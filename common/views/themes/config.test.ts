import { createTheme, pinColor } from './config';

const currentBrand = createTheme(false);
const newBrand = createTheme(true);

describe('color', () => {
  it('resolves a current-brand colour name in both palettes', () => {
    expect(currentBrand.color('neutral.400')).toBe('#d9d9d9');
    // Its nearest design system equivalent, see colorToDesignSystemColor
    expect(newBrand.color('neutral.400')).toBe('#D2D6D0');
  });

  it('passes through values that have no palette equivalent', () => {
    expect(currentBrand.color('transparent')).toBe('transparent');
    expect(newBrand.color('transparent')).toBe('transparent');
  });

  describe('when a design system colour is pinned', () => {
    it('renders the pinned colour in the current brand', () => {
      expect(currentBrand.color('orange.30', 'neutral.400')).toBe('#d9d9d9');
      expect(currentBrand.color(pinColor('orange.30', 'neutral.400'))).toBe(
        '#d9d9d9'
      );
    });

    it('renders the design system colour in the new brand', () => {
      expect(newBrand.color('orange.30', 'neutral.400')).toBe('#FFB691');
      expect(newBrand.color(pinColor('orange.30', 'neutral.400'))).toBe(
        '#FFB691'
      );
    });

    it('works for a name that both palettes use', () => {
      const white = pinColor('white', 'neutral.400');

      expect(currentBrand.color(white)).toBe('#d9d9d9');
      expect(newBrand.color(white)).toBe('#FFFFFF');
    });

    it('can pin a value CSS resolves itself', () => {
      const pinned = pinColor('orange.30', 'transparent');

      expect(currentBrand.color(pinned)).toBe('transparent');
      expect(newBrand.color(pinned)).toBe('#FFB691');
    });

    it('cannot be named without a pin', () => {
      // @ts-expect-error a design system colour needs the current-brand colour
      // to render in its place while the toggle is off
      currentBrand.color('orange.30');
      // @ts-expect-error pinColor takes the new brand colour first
      pinColor('neutral.400', 'orange.30');
    });

    it('lets two call sites sharing a current-brand colour diverge', () => {
      const one = pinColor('orange.30', 'neutral.400');
      const two = pinColor('indigo.60', 'neutral.400');

      expect(currentBrand.color(one)).toBe(currentBrand.color(two));
      expect(newBrand.color(one)).not.toBe(newBrand.color(two));
    });
  });
});
