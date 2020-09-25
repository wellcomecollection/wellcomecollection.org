/* eslint react/prop-types: 0 */

import { FunctionComponent, useCallback, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import styled from 'styled-components';
import debounce from 'lodash.debounce';

import 'react-colorful/dist/index.css';
import './react-colorful-overrides.css';

interface Props {
  name: string;
  color?: string;
  onChangeColor: (color?: string) => void;
}

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

const randomColor = (): string => {
  const rnd = () => {
    const hex = Math.floor(Math.random() * 256).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${rnd()}${rnd()}${rnd()}`;
};

const ColorPicker: FunctionComponent<Props> = ({
  name,
  color,
  onChangeColor,
}) => {
  const unset = !color;
  const [internalState, setInternalState] = useState<string>(
    typeof color === 'string' ? color : randomColor()
  );

  const debouncedHandleChange = useCallback(debounce(onChangeColor, 250), []);
  const handleChange = color => {
    setInternalState(color);
    debouncedHandleChange(color);
  };

  return (
    <>
      <input type="hidden" name={name} value={internalState} />
      <HexColorPicker color={internalState} onChange={handleChange} />
      <TextWrapper>
        <ColorLabel active={!unset}>
          {unset ? 'None' : internalState}
        </ColorLabel>
        <ClearButton onClick={() => handleChange('')}>Clear</ClearButton>
      </TextWrapper>
    </>
  );
};

export default ColorPicker;
