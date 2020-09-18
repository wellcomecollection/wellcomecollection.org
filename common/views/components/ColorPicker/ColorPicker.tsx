/* eslint react/prop-types: 0 */

import { FunctionComponent, useState } from 'react';
import {
  ColorState,
  CustomPicker,
  CustomPickerInjectedProps,
  HEXColor,
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
      <ColorLabel active={!unset}>{unset ? 'None' : props.hex}</ColorLabel>
      <ClearButton onClick={handleClear}>Clear</ClearButton>
    </TextWrapper>
  </PickerContainer>
);

const WrappedPicker = CustomPicker(PickerComponent);

const randomColor = (): HEXColor => {
  const rnd = () => {
    const hex = Math.floor(Math.random() * 256).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return {
    hex: `#${rnd()}${rnd()}${rnd()}`,
  };
};

const ColorPicker: FunctionComponent<Props> = ({
  name,
  color,
  onChangeColor,
}) => {
  const [internalState, setInternalState] = useState<HEXColor | ColorState>(
    typeof color === 'string' ? { hex: color } : randomColor()
  );
  return (
    <>
      <input type="hidden" name={name} value={internalState.hex} />
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
