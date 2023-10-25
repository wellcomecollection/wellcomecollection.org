import styled from 'styled-components';

type LLProps = {
  $small?: boolean;
  $lighten?: boolean;
  $position?: 'relative' | 'absolute';
};

// We could use `zoom` for props.$small, but it isn't supported in Firefox
// see: https://bugzilla.mozilla.org/show_bug.cgi?id=390936
const LL = styled.div<LLProps>`
  opacity: 0.2;
  width: ${props => (props.$small ? '25px' : '50px')};
  height: ${props => (props.$small ? '40px' : '80px')};

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);

  animation: animate-ll;

  ${props =>
    props.$position === 'relative' &&
    ` position: relative;
      top: 0;
      transform: translateX(-50%);`}

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: ${props => (props.$small ? '10px' : '20px')};
    background: ${props =>
      props.theme.color(props.$lighten ? 'neutral.500' : 'black')};
  }

  &::before {
    left: 0;
    animation: animate-ll 1s infinite;
  }

  &::after {
    right: 0;
    animation: animate-ll 1s 0.5s infinite;
  }

  @keyframes animate-ll {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
`;

export default LL;
