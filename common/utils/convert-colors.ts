export type HSL = {
  h: number;
  s: number;
  l: number;
};

export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type HSV = {
  h: number;
  s: number;
  v: number;
};

export const hexToRgb = (hex: string): RGB => {
  const x = parseInt(hex.replace('#', ''), 16);
  return {
    r: (x >> 16) & 0xff,
    g: (x >> 8) & 0xff,
    b: x & 0xff,
  };
};
export const rgbToHex = (rgb: RGB): string =>
  Object.values(rgb).reduce((hex, x) => {
    const n = x.toString(16);
    return hex + (n.length === 1 ? '0' + n : n);
  }, '');

// Code taken from https://css-tricks.com/converting-color-spaces-in-javascript/
export const rgbToHsl = ({ r, g, b }: RGB): HSL => {
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  // Calculate hue
  // No difference
  if (delta === 0) h = 0;
  // Red is max
  else if (cmax === r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax === g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
};

// See here for reference:
// https://en.wikipedia.org/wiki/HSL_and_HSV#Color_conversion_formulae
export const rgbToHsv = ({ r, g, b }: RGB): HSV => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hh = 0;
  if (delta !== 0) {
    if (max === r) {
      hh = (g - b) / delta;
    } else if (max === g) {
      hh = 2 + (b - r) / delta;
    } else {
      hh = 4 + (r - g) / delta;
    }

    if (hh < 0) {
      hh += 6;
    }
  }

  return {
    h: Math.round(60 * hh),
    s: Math.round(max ? (100 * delta) / max : 0),
    v: Math.round((100 * max) / 0xff),
  };
};

export const hsvToRgb = ({ h, s, v }: HSV): RGB => {
  if (s === 0) {
    return { r: v, g: v, b: v };
  }

  h /= 60;
  s /= 100;
  v /= 100;

  const hh = Math.floor(h);
  const m = v * (1 - s);
  const n = v * (1 - s * (h - hh));
  const k = v * (1 - s * (1 - h + hh));
  const idx = hh % 6;

  return {
    r: Math.round(0xff * [v, n, m, m, k, v][idx]),
    g: Math.round(0xff * [k, v, v, n, m, m][idx]),
    b: Math.round(0xff * [m, m, k, v, v, n][idx]),
  };
};

export const hexToHsv = (hex: string): HSV => rgbToHsv(hexToRgb(hex));

export const hsvToHex = (hsv: HSV): string => rgbToHex(hsvToRgb(hsv));
