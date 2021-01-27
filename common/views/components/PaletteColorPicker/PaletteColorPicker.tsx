import styled from 'styled-components';
import { FunctionComponent, useEffect, useState } from 'react';
import HueSlider from './HueSlider';
import { hexToHsv, hsvToHex } from './conversions';

type Props = {
  name: string;
  color?: string;
  onChangeColor: (color?: string) => void;
};

const palette: string[] = [
  'e02020',
  'ff47d1',
  'fa6400',
  'f7b500',
  '8b572a',
  '6dd400',
  '22bbff',
  '8339e8',
  '000000',
  'd9d3d3',
];

const Wrapper = styled.div`
  padding-top: 6px;
  max-width: 250px;
`;

const Swatches = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Swatch = styled.button<{ color: string; selected: boolean }>`
  height: 32px;
  width: 32px;
  border-radius: 50%;
  display: inline-block;
  background-color: ${({ color }) => `#${color}`};
  margin: 4px;
  border: ${({ selected }) => (selected ? '3px solid #555' : 'none')};
`;

const Slider = styled(HueSlider)`
  margin-top: 15px;
`;

const ColorLabel = styled.label<{ active: boolean }>`
  font-style: italic;
  color: ${({ active }) => (active ? '#121212' : '#565656')};
  font-size: 14px;
`;

const ClearButton = styled.button`
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

const PaletteColorPicker: FunctionComponent<Props> = ({
  name,
  color,
  onChangeColor,
}) => {
  // Because the form is not controlled we need to maintain state internally
  const [colorState, setColorState] = useState(color);

  useEffect(() => {
    setColorState(color);
  }, [color]);

  const handleColorChange = (color?: string) => {
    setColorState(color);
    onChangeColor(color);
  };

  return (
    <Wrapper>
      <input type="hidden" name={name} value={colorState || ''} />
      <Swatches>
        {palette.map(swatch => (
          <Swatch
            key={swatch}
            color={swatch}
            selected={colorState === swatch}
            onClick={() => handleColorChange(swatch)}
          />
        ))}
      </Swatches>
      <Slider
        hue={hexToHsv(colorState || palette[0]).h}
        onChangeHue={h => handleColorChange(hsvToHex({ h, s: 80, v: 90 }))}
      />
      <TextWrapper>
        <ColorLabel active={!!colorState}>
          {colorState ? `#${colorState}` : 'None'}
        </ColorLabel>
        <ClearButton onClick={() => handleColorChange(undefined)}>
          Clear
        </ClearButton>
      </TextWrapper>
    </Wrapper>
  );
};

export default PaletteColorPicker;
