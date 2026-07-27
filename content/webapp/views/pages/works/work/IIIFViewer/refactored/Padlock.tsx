import { FunctionComponent } from 'react';
import styled from 'styled-components';

const StyledPadlock = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  position: relative;
  border-radius: 50%;
  background: transparent;
  margin: 0 auto;
  top: 50%;
  transform: translateY(-50%);

  &::before,
  &::after,
  > div,
  > div::before,
  > div::after {
    content: '';
    position: absolute;
  }

  &::after,
  > div::before,
  > div::after {
    background-color: ${props => props.theme.color('black')};
  }

  /* top bar */
  &::before {
    width: 60%;
    height: 70%;
    left: 20%;
    border-radius: 40%;
    background-color: ${props => props.theme.color('warmNeutral.400')};
  }

  &::after {
    width: 36%;
    height: 60%;
    left: 32%;
    top: 10%;
    border-radius: 30%;
  }

  /* main body */
  div {
    width: 80%;
    height: 62%;
    left: 10%;
    bottom: 0;
    background-color: ${props => props.theme.color('yellow')};
    border-radius: 15%;
    z-index: 1;

    /* keyhole */
    &::before {
      width: 25%;
      height: 25%;
      left: 38%;
      top: 22%;
      border-radius: 50%;
    }

    &::after {
      width: 11%;
      height: 30%;
      left: 45%;
      top: 43%;
    }
  }
`;

const Padlock: FunctionComponent = () => (
  <StyledPadlock>
    <div></div>
  </StyledPadlock>
);

export default Padlock;
