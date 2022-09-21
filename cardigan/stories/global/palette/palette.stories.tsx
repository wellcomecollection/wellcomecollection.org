import { FunctionComponent } from 'react';
import { themeValues } from '@weco/common/views/themes/config';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import Divider from '@weco/common/views/components/Divider/Divider';

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
    ${props => (props.hasBorder ? props.theme.color('silver') : 'transparent')};

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

// Code taken from https://css-tricks.com/converting-color-spaces-in-javascript/
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

const coreColorsArray = [];
let objectColors = {};

Object.entries(themeValues.newColors)
  .map(([key, value]) => {
    if (typeof value === 'string') {
      const rgb = hexToRgb(value);

      coreColorsArray.push(
        value.indexOf('#') > -1 && {
          // Don't display e.g. 'currentColor' or 'transparent'
          name: key.replace(/'/g, ''),
          hex: value,
          rgb,
          hsl: rgbToHsl(rgb),
        }
      );
    } else {
      // TODO
      const info = { name: '', description: '' };
      switch (key) {
        case 'accent':
          info.name = 'Accents';
          info.description =
            'Chosen to match the core yellow, these can be used throughout the website as accent colours.';
          break;
        case 'neutral':
          info.name = 'Neutrals';
          info.description =
            'Greyscale; these names follow Material design and font-weight inspired naming, where the "thicker" the font, the darker the grey. Some of them have equivalents in warmNeutrals, twinned through their name. They are considered equivalents because of their luminosity levels.';
          break;
        case 'warmNeutral':
          info.name = 'Warm Neutrals';
          info.description =
            'Warmer versions of Neutrals, they all match their equivalent in name, but with a warmer tone reminiscent of the core yellow. They are considered equivalents because of their luminosity levels.';
          break;
        case 'validation':
          info.name = 'Validation';
          info.description =
            'These colours should be used solely for validation purposes. We encourage the use of different shades if for other purposes.';
          break;
      }
      const subColors = Object.entries(value).map(([k, v]) => {
        const rgb = hexToRgb(v);

        return (
          v.indexOf('#') > -1 && {
            name: `${k}`,
            hex: v,
            rgb,
            hsl: rgbToHsl(rgb),
          }
        );
      });
      objectColors = { ...objectColors, [key]: { ...info, subColors } };
    }
  })
  .filter(Boolean);

export const Palette: FunctionComponent = () => {
  return (
    <>
      <SectionTitle>Core</SectionTitle>
      <SectionDescription>
        Core colours used throughout the website.
      </SectionDescription>
      <PaletteSection>
        {coreColorsArray.map(color => (
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
      {Object.keys(objectColors).map(category => (
        <SectionWrapper key={category}>
          <Divider color="black" isKeyline={true} />
          <SectionTitle>{objectColors[category].name}</SectionTitle>
          <SectionDescription>
            {objectColors[category].description}
          </SectionDescription>
          <PaletteSection>
            {objectColors[category].subColors.map(color => (
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
        </SectionWrapper>
      ))}
    </>
  );
};
