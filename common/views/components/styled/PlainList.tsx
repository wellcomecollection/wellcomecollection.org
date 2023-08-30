import styled, { css } from 'styled-components';

export const plainListStyles = css`
  list-style: none;
  margin: 0 !important;
  padding: 0;
`;

const PlainList = styled.ul`
  ${plainListStyles};
`;

export default PlainList;
