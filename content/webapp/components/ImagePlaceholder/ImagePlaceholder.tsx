import { FC } from 'react';
import type { ColorSelection } from '../../types/color-selections';
import { transparentGif, repeatingLs } from '@weco/common/utils/backgrounds';
import styled from 'styled-components';

const Wrapper = styled.div<{
  color: ColorSelection | undefined;
}>`
  position: relative;
  background: ${props => props.theme.color(props.color)};
`;

const Pattern = styled.div`
  position: absolute;
  background-image: ${`url('${repeatingLs}')`};
  background-size: cover;
  width: 100%;
  height: 100%;
  top: 0;
  opacity: 0.5;
`;

type Props = {
  color?: ColorSelection;
};

const ImagePlaceholder: FC<Props> = ({ color }: Props) => (
  <Wrapper color={color}>
    <img src={transparentGif} alt="" width="1" height="1" />
    <Pattern />
  </Wrapper>
);

export default ImagePlaceholder;
