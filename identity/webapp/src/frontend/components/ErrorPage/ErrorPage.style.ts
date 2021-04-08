import styled from 'styled-components';

export const LogoContainer = styled.div`
  margin: auto;
  padding: 0 0 42px 0;
  width: 200px;
  border-bottom: 0.2px solid grey;
`;

export const Auth0StyleErrorBox = styled.div`
  background-color: white;
  padding: 42px;
  margin: auto;
  border-radius: 5px;
  height: 400px;
  width: 300px;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0ede3;
  padding: auto;
  height: 100%;
`;

export const ErrorMessage = styled.p`
  text-align: center;
`;
