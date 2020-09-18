/* eslint react/prop-types: 0 */

import { FunctionComponent, useState } from 'react';
import {
  Color,
  CustomPicker,
  CustomPickerInjectedProps,
  RGBColor,
} from 'react-color';
import { Hue, Saturation } from 'react-color/lib/components/common';
import styled from 'styled-components';

interface Props {
  name: string;
  color?: string;
  onChangeColor: (color?: string) => void;
}

const PickerContainer = styled.div`
  position: relative;
`;

const SaturationWrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 190px;
  height: 130px;
  border-radius: 4px 4px 0 0;
`;

const HueWrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 190px;
  height: 18px;
  border-top: 1px solid white;
  border-radius: 0 0 4px 4px;
`;

const HueHandle = styled.span`
  display: block;
  height: 16px;
  width: 8px;
  border-radius: 3px;
  border: 1px solid white;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
`;

// Prevents React warning about onChangeComplete
const HueHandleWithFilteredProps: FunctionComponent<any> = ({
  onChangeComplete,
  ...props
}) => <HueHandle {...props} />;

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
  margin-top: 4px;
  max-width: 190px;
`;

const PickerComponent: FunctionComponent<CustomPickerInjectedProps & {
  unset: boolean;
  handleClear: () => void;
}> = ({ unset, handleClear, ...props }) => (
  <PickerContainer>
    <SaturationWrapper>
      <Saturation {...props} />
    </SaturationWrapper>
    <HueWrapper>
      <Hue {...props} pointer={HueHandleWithFilteredProps} />
    </HueWrapper>
    <TextWrapper>
      <ColorLabel active={!unset}>
        {unset ? 'None' : `rgb(${props.rgb.r}, ${props.rgb.g}, ${props.rgb.b})`}
      </ColorLabel>
      <ClearButton onClick={handleClear}>Clear</ClearButton>
    </TextWrapper>
  </PickerContainer>
);

const WrappedPicker = CustomPicker(PickerComponent);

const randomColor = (): RGBColor => {
  const rnd = () => Math.floor(Math.random() * 256);
  return { r: rnd(), g: rnd(), b: rnd() };
};

const ColorPicker: FunctionComponent<Props> = ({
  name,
  color,
  onChangeColor,
}) => {
  // Has an internal state because of this issue
  // https://github.com/casesandberg/react-color/issues/754
  // TODO a proper solution
  const [internalState, setInternalState] = useState<Color | undefined>(
    color ? { hex: color } : randomColor()
  );
  return (
    <>
      <input type="hidden" name={name} value={color || ''} />
      <WrappedPicker
        unset={!color}
        handleClear={() => onChangeColor(undefined)}
        color={internalState}
        onChange={setInternalState}
        onChangeComplete={c => onChangeColor(c.hex)}
      />
    </>
  );
};

export default ColorPicker;
