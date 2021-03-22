import styled from 'styled-components';

export const Form = styled.form`
  display: grid;
  grid-template-columns: [labels] auto [controls] 1fr [errors] 1fr;
  grid-auto-flow: row;
  grid-gap: 1em;

  & > button {
    grid-column: controls;
  }
`;

export const Label = styled.label`
  grid-column: labels;
  grid-row: auto;
  text-align: right;
  font-size: 1.2em;
  padding: 0.4em;
`;

export const Input = styled.input`
  grid-column: controls;
  grid-row: auto;
  font-size: 1.2em;
  padding: 0.4em;
`;

export const InvalidField = styled.div.attrs({ role: 'alert' })`
  grid-column: errors;
  grid-row: auto;
  font-size: 1.2em;
  padding: 0.4em;
  color: #dc3545;
`;
