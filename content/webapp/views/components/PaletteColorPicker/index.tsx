import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { font } from '@weco/common/utils/classnames';
import { hexToHsv, hsvToHex } from '@weco/content/utils/convert-colors';

import HueSlider from './PaletteColorPicker.HueSlider';

export type PaletteColorPickerProps = {
  name: string;
  color?: string;
  onChangeColor: (color?: string) => void;
  form?: string;
};

type ColorSwatch = {
  hexValue: string;
  colorName: string;
};

export const palette: ColorSwatch[] = [
  {
    hexValue: 'e02020',
    colorName: 'Red',
  },
  {
    hexValue: 'ff47d1',
    colorName: 'Pink',
  },
  {
    hexValue: 'fa6400',
    colorName: 'Orange',
  },
  {
    hexValue: 'f7b500',
    colorName: 'Yellow',
  },
  {
    hexValue: '8b572a',
    colorName: 'Brown',
  },
  {
    hexValue: '6dd400',
    colorName: 'Green',
  },
  {
    hexValue: '22bbff',
    colorName: 'Blue',
  },
  {
    hexValue: '8339e8',
    colorName: 'Violet',
  },
  {
    hexValue: '000000',
    colorName: 'Black',
  },
  {
    hexValue: 'd9d3d3',
    colorName: 'Grey',
  },
];

const Wrapper = styled.div`
  padding-top: 6px;
  max-width: 250px;
`;

const Swatches = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

type SwatchProps = {
  $hexColor: string;
  $ariaPressed: boolean;
};

const Swatch = styled.button.attrs<{
  $ariaPressed: boolean;
  $hexColor: string;
}>((props: SwatchProps) => ({
  type: 'button',
  className: font('intr', 5),
  'aria-pressed': !!props.$ariaPressed,
}))<SwatchProps>`
  position: relative;
  padding-left: 40px;
  flex: 1 0 50%;
  line-height: normal;
  margin-bottom: 8px;
  min-height: 32px;
  color: ${props =>
    props.theme.color('black')}; /* This avoids the default blue links on iOS */

  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 0;
    height: 32px;
    width: 32px;
    border-radius: 50%;
    background-color: ${({ $hexColor }) => `#${$hexColor}`};
    border: ${({ $ariaPressed }) => ($ariaPressed ? '3px solid #555' : 'none')};
  }
`;

const Slider = styled(HueSlider)`
  margin-top: 15px;
`;

const ColorLabel = styled.span<{ $active: boolean }>`
  font-style: italic;
  color: ${({ $active }) => ($active ? '#121212' : '#565656')};
  font-size: 14px;
`;

const ClearButton = styled.button.attrs({ type: 'button' })`
  border: 0;
  padding: 0;
  background: none;
  text-decoration: underline;
  color: #121212;
  font-size: 12px;
`;

const TextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

export function getColorDisplayName(color: string | null): string | null {
  if (color) {
    const matchingPaletteColor = palette.find(
      swatch => swatch.hexValue.toUpperCase() === color.toUpperCase()
    );
    const hexValue = `#${color.toUpperCase()}`;
    return matchingPaletteColor ? matchingPaletteColor.colorName : hexValue;
  } else {
    return 'None';
  }
}

const PaletteColorPicker: FunctionComponent<PaletteColorPickerProps> = ({
  name,
  color,
  onChangeColor,
  form,
}) => {
  // Because the form is not controlled we need to maintain state internally
  const [colorState, setColorState] = useState(color);
  const { isEnhanced } = useAppContext();
  const firstRender = useRef(true);

  useEffect(() => {
    setColorState(color);
  }, [color]);

  useEffect(() => {
    if (!firstRender.current) {
      onChangeColor(color);
    } else {
      firstRender.current = false;
    }
  }, [colorState]);

  return (
    <Wrapper data-component="palette-color-picker">
      {!isEnhanced && (
        <input
          form={form}
          type="color"
          name={name}
          defaultValue={
            color
              ? color[0] === '#' || color[0] === '%' // url encoded value for the hash symbol is '%23'
                ? color
                : '#' + color
              : ''
          }
        />
      )}
      {isEnhanced && (
        <>
          <input
            form={form}
            type="hidden"
            name={name}
            value={colorState || ''}
          />
          <Swatches>
            {palette.map(swatch => (
              <Swatch
                key={swatch.hexValue}
                $hexColor={swatch.hexValue}
                $ariaPressed={colorState === swatch.hexValue}
                onClick={() => setColorState(swatch.hexValue)}
              >
                {swatch.colorName}
              </Swatch>
            ))}
          </Swatches>
          <Slider
            hue={hexToHsv(colorState || palette[0].hexValue).h}
            onChangeHue={h => setColorState(hsvToHex({ h, s: 80, v: 90 }))}
          />
          <TextWrapper>
            <ColorLabel $active={!!colorState} role="status">
              {getColorDisplayName(colorState || null)}
            </ColorLabel>
            <ClearButton onClick={() => setColorState(undefined)}>
              Clear
            </ClearButton>
          </TextWrapper>
        </>
      )}
    </Wrapper>
  );
};

export default PaletteColorPicker;
