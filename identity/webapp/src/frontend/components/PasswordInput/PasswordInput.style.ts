import styled from 'styled-components';
import { TextInput } from '../Form.style';

export const ShowPasswordButton = styled.button.attrs({ type: 'button' })`
  height: 55px;
  width: 55px;
  background: none;
  border: none;
`;

export const Border = styled.div<{ invalid: boolean }>`
  display: flex;
  width: 100%;
  border: ${props => (props.invalid ? 'solid 2px #d1192c' : 'solid 1px #8f8f8f')};
  margin: 0.333em 0;
  border-radius: 6px;
`;
export const Input = styled(TextInput)`
  height: 55px;
  padding: 0.7em;
  margin: 0;
  border: none;
  flex-grow: 2;
`;

export const RulesList = styled.ul`
  margin-top: -0.1em;
`;
