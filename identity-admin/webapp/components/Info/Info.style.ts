import styled from 'styled-components';

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
`;

export const StatusBox = styled.aside`
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 1em;
  margin-bottom: 1em;
`;

export const AccountDetailsList = styled.dl`
  display: flex;
  gap: 3em;
`;

export const AccountDetail = styled.div`
  display: flex;
  gap: 1em;
`;

export const AccountDetailsLabel = styled.dt`
  font-weight: bold;
`;

export const AccountDetailsValue = styled.dd`
  margin: 0;
`;
