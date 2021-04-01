import styled from 'styled-components';

export const Section = styled.section`
  width: 100%;
`;

export const Loading = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
  margin-bottom: 2em;
`;

export const Field = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;

  & > button {
    margin-top: auto;
  }
`;

export const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.6em;
`;

export const Input = styled.input`
  font-size: 1.2em;
  padding: 0.5em;
  border-radius: 6px;
  border: 1px solid rgb(217, 214, 206);
`;

export const InvalidField = styled.div.attrs({ role: 'alert' })`
  grid-row: auto;
  font-size: 1.2em;
  padding: 0.4em;
  color: #dc3545;
`;
