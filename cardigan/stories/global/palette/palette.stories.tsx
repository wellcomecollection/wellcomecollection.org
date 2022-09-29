import { FunctionComponent } from 'react';
import { themeValues } from '@weco/common/views/themes/config';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import Divider from '@weco/common/views/components/Divider/Divider';

type PaletteColors = {
  [id: string]: Category;
};

type Category = {
  label: string;
  description: string;
  colors?: Record<string, ColorObject>;
};

type ColorObject = {
  hex: string;
  rgb: RGB;
  hsl: HSL;
};

type HSL = {
  h: number;
  s: number;
  l: number;
};

type RGB = {
  r: number;
  g: number;
  b: number;
};

const PaletteSection = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const SectionWrapper = styled.div`
  margin: 1rem 0;
`;

const SectionTitle = styled.h2.attrs({ className: 'h2' })`
  padding: 2rem 0 0;
`;

const SectionDescription = styled.p.attrs({ className: font('intr', 6) })``;

const PaletteBlock = styled.div`
  flex-basis: 25%;
  margin-bottom: 15px;
`;

const PaletteName = styled.h3.attrs({
  classname: font('lr', 6),
})``;

const PaletteColor = styled.div<{ hasBorder: boolean }>`
  position: relative;
  min-width: 200px;
  margin-right: 15px;
  border: 1px solid
    ${props =>
      props.hasBorder ? props.theme.color('neutral.500') : 'transparent'};

  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
`;

const PaletteHex = styled.div.attrs({
  className: font('lr', 6),
})``;

const PaletteCode = styled.code.attrs({
  className: font('lr', 6),
})``;

function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Code taken from https://css-tricks.com/converting-color-spaces-in-javascript/
function rgbToHsl({ r, g, b }: RGB): HSL {
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
}

let paletteColors: PaletteColors = {
  core: {
    label: 'Core',
    description:
      'The core colour theme is defined as black, white and yellow. This is a constant theme which persists across the product. As a result, any additional colours should be complimentary to these.',
  },
  accent: {
    label: 'Accents',
    description:
      'Chosen to match the core yellow, accent colours are interspersed where appropriate for uses such as: defining a theme or differentiating types of content.',
  },
  neutral: {
    label: 'Neutrals',
    description:
      'The neutral theme is used for structural page elements such as dividers and UI components. Their variable names follow Material design and font-weight inspired naming, where the "thicker" the font, the darker the grey. Some of them have equivalents in warmNeutrals, twinned through their name. They are considered equivalents because of their luminosity levels.',
  },
  warmNeutral: {
    label: 'Warm Neutrals',
    description:
      'Warmer versions of Neutrals, they all match their equivalent in name, but with a warmer tone reminiscent of the core yellow. They are considered equivalents because of their luminosity levels.',
  },
  validation: {
    label: 'Validation',
    description:
      'These colours should be used solely for validation purposes. We encourage the use of different shades if for other purposes.',
  },
};

Object.entries(themeValues.colors)
  .map(([key, value]) => {
    if (!key.includes('.')) {
      const rgb = hexToRgb(value);
      paletteColors.core.colors = {
        ...paletteColors.core.colors,
        [key]: {
          hex: value,
          rgb,
          hsl: rgbToHsl(rgb),
        },
      };
    } else {
      const rgb = hexToRgb(value);
      const [category, colorName] = key.split('.');

      paletteColors = {
        ...paletteColors,
        [category]: {
          ...paletteColors[category],
          colors: {
            ...paletteColors[category].colors,
            [colorName]: {
              hex: value,
              rgb,
              hsl: rgbToHsl(rgb),
            },
          },
        },
      };
    }
  })
  .filter(Boolean);

export const Palette: FunctionComponent = () => (
  <>
    {Object.keys(paletteColors).map((category, i) => (
      <SectionWrapper key={category}>
        {i !== 0 && <Divider color="black" isKeyline={true} />}
        <SectionTitle>{paletteColors[category].label}</SectionTitle>
        <SectionDescription>
          {paletteColors[category].description}
        </SectionDescription>
        <PaletteSection>
          {Object.entries(paletteColors[category].colors).map(
            ([colorName, colorValues]) => (
              <PaletteBlock key={colorName}>
                <PaletteName>{colorName}</PaletteName>
                <PaletteColor
                  hasBorder={colorName === 'white'}
                  style={{ background: colorValues.hex }}
                />
                <PaletteHex>
                  Hex: <PaletteCode>{colorValues.hex}</PaletteCode>
                </PaletteHex>
                <PaletteHex>
                  RGB:{' '}
                  <PaletteCode>
                    {colorValues.rgb.r}, {colorValues.rgb.g},{' '}
                    {colorValues.rgb.b}
                  </PaletteCode>
                </PaletteHex>
                <PaletteHex>
                  HSL:{' '}
                  <PaletteCode>
                    {colorValues.hsl.h}, {colorValues.hsl.s},{' '}
                    {colorValues.hsl.l}%
                  </PaletteCode>
                </PaletteHex>
              </PaletteBlock>
            )
          )}
        </PaletteSection>
      </SectionWrapper>
    ))}
  </>
);
