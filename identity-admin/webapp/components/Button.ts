import styled from 'styled-components';

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5em;
  width: 100%;
  height: 43px;
  font-size: 1.2em;
`;

export const DangerButton = styled(Button)`
  background-color: #dc3545;
`;
