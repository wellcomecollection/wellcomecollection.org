import styled from 'styled-components';

export const UsageDetailsList = styled.dl`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1em;
`;

export const UsageDetail = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
`;

export const Label = styled.dt`
  font-weight: bold;
`;

export const Value = styled.dd`
  margin: 0;
`;
