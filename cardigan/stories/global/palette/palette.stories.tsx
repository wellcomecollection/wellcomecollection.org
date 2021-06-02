import { FunctionComponent } from 'react';
import { themeValues } from '@weco/common/views/themes/config';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';

const PaletteSection = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const PaletteBlock = styled.div`
  flex-basis: 25%;
  margin-bottom: 15px;
`;

const PaletteName = styled.h2.attrs({
  classname: classNames({
    [font('lr', 5)]: true,
  }),
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
  className: classNames({
    [font('lr', 5)]: true,
  }),
})``;

const PaletteCode = styled.code.attrs({
  className: classNames({
    [font('lr', 5)]: true,
  }),
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

const colorsArr = Object.entries(themeValues.colors)
  .map(([key, value]) => {
    return (
      value.base.indexOf('#') > -1 && {
        // Don't display e.g. 'currentColor' or 'transparent'
        name: key.replace(/'/g, ''),
        hex: value.base,
        rgb: hexToRgb(value.base),
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
        </PaletteBlock>
      ))}
    </PaletteSection>
  );
};
