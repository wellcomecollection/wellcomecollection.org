import styled from 'styled-components';

export const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: ${props => props.theme.sizes.xlarge}px;
  padding: 0
    ${props =>
      props.theme.formatContainerPadding(props.theme.containerPadding.small)};

  ${props =>
    props.theme.media('medium')(`
    padding: 0 ${props.theme.formatContainerPadding(props.theme.containerPadding.medium)};
  `)}

  ${props =>
    props.theme.media('large')(`
    padding: 0 ${props.theme.formatContainerPadding(props.theme.containerPadding.large)};
  `)}
`;
