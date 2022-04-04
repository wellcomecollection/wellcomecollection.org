import styled from 'styled-components';
// TODO go through colours with Gareth 0.
// Not many colours in Zeplin designs match with those available from theme.
// May not be accessible need to check.

// TODO go through hover styles with Gareth 0.

// TODO go through mobile styles with Gareth 0.

// TODO look at David's styling from previous PRs
export const DatePicker = styled.div`
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  box-shadow: -2px -2px 8px 0 rgba(0, 0, 0, 0.3);
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

  th,
  td {
    display: inline-block;
    width: 2em;
    height: 2em;
    text-align: center;
    cursor: pointer;
  }

  td {
    border-radius: 50%;
  }

  td[disabled] {
    cursor: default;
    border: 1px solid ${props => props.theme.color('transparent')};
    color: ${props => props.theme.color('marble')};
  }

  td:not([disabled]):hover,
  td:not([disabled]):focus {
    border: 1px solid ${props => props.theme.color('pewter')};
    outline: 0;
  }

  td[tabindex='0'] {
    background: ${props => props.theme.color('green')};
    border: 1px solid ${props => props.theme.color('green')};
    color: ${props => props.theme.color('white')};
  }

  td[aria-selected='true'] {
    background: ${props => props.theme.color('yellow')};
    color: ${props => props.theme.color('black')};
    border: 1px solid ${props => props.theme.color('yellow')};
  }

  td[aria-selected='true']:focus {
    border: 1px solid ${props => props.theme.color('black')};
  }
`;

type TdProps = {
  disabled: boolean;
};

export const Td = styled.td.attrs<TdProps>(props => ({
  disable: props.disabled,
}))<TdProps>``; // TODO move styles here
