import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

type Props = {
  isEnhanced: boolean;
};

const FadeInUnenhanced = styled.div<Props>`
  opacity: ${props => (props.isEnhanced ? '1' : '0')};
  animation: ${fadeIn} 1s 1s forwards;

  ${props =>
    props.isEnhanced &&
    `
    animation: none;
  `}
`;

export default FadeInUnenhanced;
