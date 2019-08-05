import styled from 'styled-components';

const LL = styled.div`
  position: absolute;
  opacity: 0.2;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  display: none;
  width: 50px;
  height: 80px;
  animation: animate-ll;
  ${props => props.small && 'zoom: 0.5;'}

  .enhanced & {
    display: block;
  }

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20px;
    background: black;
  }

  &:before {
    left: 0;
    animation: animate-ll 1s infinite;
  }

  &:after {
    right: 0;
    animation: animate-ll 1s 0.5s infinite;
  }
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
}`;

export default LL;
