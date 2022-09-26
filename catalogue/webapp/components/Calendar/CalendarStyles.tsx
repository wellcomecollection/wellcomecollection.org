import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';

export const DatePicker = styled.div`
  padding: 1em;

  button {
    border-style: none;
    background: transparent;
    cursor: pointer;
    border: 1px solid ${props => props.theme.color('silver')};
    :disabled {
      cursor: default;
    }
  }
`;

export const Header = styled.div`
  background-color: ${props => props.theme.newColor('white')};
  display: flex;
  color: ${props => props.theme.newColor('neutral.600')};

  div {
    margin-left: auto;
  }
`;

export const Message = styled.p.attrs(() => ({
  className: font('intr', 6),
}))`
  background: ${props => props.theme.newColor('yellow')};
  padding: ${props => `${props.theme.spacingUnit * 2}px`};
  margin: ${props => `${props.theme.spacingUnit}px`};
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
`;

export const Table = styled.table`
  color: ${props => props.theme.newColor('neutral.600')};

  th,
  td {
    display: inline-block;
    width: 2.5em;
    height: 2.5em;
    text-align: center;
  }
`;

type TdProps = {
  isKeyboard: boolean;
};

export const Td = styled.td<TdProps>`
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid transparent;

  &[aria-disabled='true'] {
    cursor: default;
    color: ${props => props.theme.color('marble')};
  }

  &[tabindex='0']:focus {
    background: ${props => props.theme.newColor('accent.green')};
    color: ${props => props.theme.newColor('white')};
    outline: 0;
    box-shadow: ${props =>
      props.isKeyboard ? props.theme.focusBoxShadow : 'none'};
  }

  &[aria-selected='true'] {
    background: ${props => props.theme.newColor('yellow')};
    color: ${props => props.theme.newColor('black')};
  }
`;

export const Number = styled.span`
  position: relative;
  top: 4px;
`;

export const CalendarButton = styled.button`
  border: 0;
  display: inline-block;
  width: 2em;
  height: 2em;
  line-height: 2em;
  border-radius: 50%;
  margin-left: 0.5em;
  background: ${props => props.theme.color('silver')};
`;
