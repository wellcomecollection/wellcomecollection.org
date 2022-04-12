import styled from 'styled-components';

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
  background-color: ${props => props.theme.color('white')};
  display: flex;
  color: ${props => props.theme.color('pewter')};

  div {
    margin-left: auto;
  }
`;

export const Table = styled.table`
  color: ${props => props.theme.color('pewter')};
  th,
  td {
    display: inline-block;
    width: 2.5em;
    height: 2.5em;
    text-align: center;
  }
`;

export const Td = styled.td`
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.color('transparent')};

  &[aria-disabled='true'] {
    cursor: default;
    color: ${props => props.theme.color('marble')};
  }

  &[tabindex='0']:focus {
    background: ${props => props.theme.color('green')};
    color: ${props => props.theme.color('white')};
    outline: 0;
    .is-keyboard & {
      box-shadow: ${props => props.theme.focusBoxShadow};
    }
  }

  &[aria-selected='true'] {
    background: ${props => props.theme.color('yellow')};
    color: ${props => props.theme.color('black')};
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
