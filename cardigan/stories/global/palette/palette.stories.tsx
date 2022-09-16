import { FunctionComponent } from 'react';
import { themeValues } from '@weco/common/views/themes/config';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';

const PaletteSection = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const PaletteBlock = styled.div`
  flex-basis: 25%;
  margin-bottom: 15px;
`;

const PaletteName = styled.h2.attrs({
  classname: font('lr', 5),
})``;

const PaletteColor = styled.div<{ hasBorder: boolean }>`
  position: relative;
  min-width: 200px;
  margin-right: 15px;
  border: 1px solid
    ${props => props.theme.color(props.hasBorder ? 'silver' : 'transparent')};

  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
`;

const PaletteHex = styled.div.attrs({
  className: font('lr', 5),
})``;

const PaletteCode = styled.code.attrs({
  className: font('lr', 5),
})``;

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHsl({ r, g, b }) {
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

const colorsArr = Object.entries(themeValues.colors)
  .map(([key, value]) => {
    const rgb = hexToRgb(value.base);
    return (
      value.base.indexOf('#') > -1 && {
        // Don't display e.g. 'currentColor' or 'transparent'
        name: key.replace(/'/g, ''),
        hex: value.base,
        rgb,
        hsl: rgbToHsl(rgb),
      }
    );
  })
  .filter(Boolean);

export const Palette: FunctionComponent = () => {
  return (
    <PaletteSection>
      {colorsArr.map(color => (
        <PaletteBlock key={color.name}>
          <PaletteName>{color.name}</PaletteName>
          <PaletteColor
            hasBorder={color.name === 'white'}
            style={{ background: color.hex }}
          />
          <PaletteHex>
            Hex: <PaletteCode>{color.hex}</PaletteCode>
          </PaletteHex>
          <PaletteHex>
            RGB:{' '}
            <PaletteCode>
              {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
            </PaletteCode>
          </PaletteHex>
          <PaletteHex>
            HSL:{' '}
            <PaletteCode>
              {color.hsl.h}, {color.hsl.s}, {color.hsl.l}%
            </PaletteCode>
          </PaletteHex>
        </PaletteBlock>
      ))}
    </PaletteSection>
  );
};
