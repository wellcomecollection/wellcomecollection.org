type Hsv = {
  h: number;
  s: number;
  v: number;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

const hexToRgb = (hex: string): Rgb => {
  const x = parseInt(hex, 16);
  return {
    r: (x >> 16) & 0xff,
    g: (x >> 8) & 0xff,
    b: x & 0xff,
  };
};

const rgbToHex = (rgb: Rgb): string =>
  Object.values(rgb).reduce((hex, x) => {
    const n = x.toString(16);
    return hex + (n.length === 1 ? '0' + n : n);
  }, '');

// See here for reference:
// https://en.wikipedia.org/wiki/HSL_and_HSV#Color_conversion_formulae

const rgbToHsv = ({ r, g, b }: Rgb): Hsv => {
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

const hsvToRgb = ({ h, s, v }: Hsv): Rgb => {
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

export const hexToHsv = (hex: string): Hsv => rgbToHsv(hexToRgb(hex));

export const hsvToHex = (hsv: Hsv): string => rgbToHex(hsvToRgb(hsv));
