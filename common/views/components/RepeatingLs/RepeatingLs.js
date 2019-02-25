import styled from 'styled-components';

const RepeatingLsEl = styled.div`
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: repeating-linear-gradient(
    -45deg,
    ${props => props.theme.colors[props.foreground]},
    ${props => props.theme.colors[props.foreground]} 10px,
    ${props => props.theme.colors[props.background]} 10px,
    ${props => props.theme.colors[props.background]} 50px
  );

  &:before {
    position: absolute;
    z-index: 0;
    content: '';
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: repeating-linear-gradient(
      45deg,
      ${props => props.theme.colors[props.background]},
      ${props => props.theme.colors[props.background]} 20px,
      transparent 10px,
      transparent 60px
    );
  }
`;

type Props = {|
  foreground: string,
  background: string,
|};

const RepeatingLs = ({ foreground, background }: Props) => (
  <RepeatingLsEl foreground={foreground} background={background} />
);

export default RepeatingLs;
