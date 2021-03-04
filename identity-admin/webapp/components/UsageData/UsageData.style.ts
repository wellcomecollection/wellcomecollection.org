import styled from 'styled-components';

export const Container = styled.div`
  padding-top: 1em;
  display: grid;
  grid-template-columns: [labels] auto [values] 1fr;
  grid-auto-flow: row;
  grid-gap: 1em;
`;

export const Name = styled.span`
  grid-column: labels;
  grid-row: auto;
  font-weight: bold;
  text-align: right;
`;

export const Value = styled.span`
  grid-column: values;
  grid-row: auto;
`;
