import {
  hexToHsv,
  hexToRgb,
  hsvToHex,
  hsvToRgb,
  type RGB,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
} from './convert-colors';

describe('convert-colors', () => {
  it('hexToRgb converts hex to RGB', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('rgbToHex converts RGB to hex', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('ff0000');
  });

  it('rgbToHsl converts RGB to HSL', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
  });

  it('rgbToHsv converts RGB to HSV', () => {
    expect(rgbToHsv({ r: 255, g: 0, b: 0 })).toEqual({
      h: 0,
      s: 100,
      v: 100,
    });
  });

  it('hsvToRgb converts HSV to RGB', () => {
    expect(hsvToRgb({ h: 0, s: 100, v: 100 })).toEqual({
      r: 255,
      g: 0,
      b: 0,
    });
  });

  it('hexToHsv converts hex to HSV', () => {
    expect(hexToHsv('#FF0000')).toEqual({ h: 0, s: 100, v: 100 });
  });

  it('hsvToHex converts HSV to hex', () => {
    expect(hsvToHex({ h: 0, s: 100, v: 100 })).toBe('ff0000');
  });

  it('round-trip: RGB to HSV and back', () => {
    const originalRgb: RGB = { r: 255, g: 0, b: 0 };
    const hsv = rgbToHsv(originalRgb);
    const rgbBack = hsvToRgb(hsv);
    expect(rgbBack).toEqual(originalRgb);
  });
});
