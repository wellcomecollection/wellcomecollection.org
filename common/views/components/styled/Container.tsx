import styled from 'styled-components';

export const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: ${props => props.theme.sizes.xlarge}px;
  padding: 0 ${props => props.theme.containerPadding};
`;
