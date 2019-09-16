import styled from 'styled-components';
import { leaningLMask } from '../../../utils/backgrounds';

type Props = {|
  foreground: string,
  background: string,
  size: number,
|};

const RepeatingLsOuter = styled.div`
  background: ${props => props.theme.colors[props.foreground]};
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const ReapeatingLsInner = styled.div`
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  mask-size: ${props => props.size}px;
  background: ${props => props.theme.colors[props.background]};
  mask-image: url(${props => props.mask});
  mask-repeat: repeat;
`;

const RepeatingLs = ({ foreground, background, size }: Props) => (
  <RepeatingLsOuter foreground={foreground}>
    <ReapeatingLsInner
      mask={leaningLMask}
      size={size}
      background={background}
    />
  </RepeatingLsOuter>
);

export default RepeatingLs;
