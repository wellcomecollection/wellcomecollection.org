import styled from 'styled-components';

export const UsageDetailsList = styled.dl`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1em;
`;

export const UsageDetail = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: auto;
  grid-gap: 0.333em;
`;

export const Label = styled.dt`
  font-weight: bold;
  grid-row: 1 / auto;
`;

export const Value = styled.dd<{ minor?: boolean }>`
  grid-column-start: 2;
  margin: 0;
  ${props => props.minor && 'font-size: 0.9em;'}
`;
