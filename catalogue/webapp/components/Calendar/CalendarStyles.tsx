import styled from 'styled-components';

export const DatePicker = styled.div`
  border: 1px solid ${props => props.theme.color('pumice')};
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  /* box-shadow: -2px -2px 8px 0 rgba(0, 0, 0, 0.3); */
  margin-top: 0.5em;
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
  /* display: flex; */

  h2 {
    color: ${props => props.theme.color('pewter')};
  }
`;

export const Table = styled.table`
  color: ${props => props.theme.color('pewter')};
  th {
    display: inline-block;
    width: 1.9em;
    height: 1.9em;
  }
`;

export const Td = styled.td`
  display: inline-block;
  width: 1.9em;
  height: 1.9em;
  text-align: center;
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.color('transparent')};

  &[aria-disabled='true'] {
    cursor: default;
    color: ${props => props.theme.color('marble')};
  }

  &[tabindex='0']:focus {
    outline: none;
    background: ${props => props.theme.color('green')};
    color: ${props => props.theme.color('white')};
  }

  &[aria-selected='true'] {
    background: ${props => props.theme.color('yellow')};
    color: ${props => props.theme.color('black')};
  }
`;
