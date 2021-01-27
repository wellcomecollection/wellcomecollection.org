import styled from 'styled-components';
import { FunctionComponent } from 'react';
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

const PaletteColorPicker: FunctionComponent<Props> = ({
  name,
  color = palette[0],
  onChangeColor,
}) => (
  <>
    <input type="hidden" name={name} value={color} />
    <Swatches>
      {palette.map(swatch => (
        <Swatch
          key={swatch}
          color={swatch}
          selected={color === swatch}
          onClick={() => onChangeColor(swatch)}
        />
      ))}
    </Swatches>
    <HueSlider
      hue={hexToHsv(color).h}
      onChangeHue={h => onChangeColor(hsvToHex({ h, s: 80, v: 90 }))}
    />
  </>
);

export default PaletteColorPicker;
