import { FunctionComponent } from 'react';
import type { ColorSelection } from '../../types/color-selections';
import { transparentGif, repeatingLs } from '@weco/common/utils/backgrounds';
import styled from 'styled-components';

const Wrapper = styled.div<{
  $backgroundColor: ColorSelection;
}>`
  position: relative;
  background: ${props => props.theme.color(props.$backgroundColor)};
`;

const Pattern = styled.div`
  position: absolute;
  background-image: url('${repeatingLs}');
  background-size: cover;
  width: 100%;
  height: 100%;
  top: 0;
  opacity: 0.5;
`;

type Props = {
  backgroundColor?: ColorSelection;
};

const ImagePlaceholder: FunctionComponent<Props> = ({ backgroundColor }) => (
  <Wrapper $backgroundColor={backgroundColor || 'accent.purple'}>
    <img src={transparentGif} alt="" width="1" height="1" />
    <Pattern />
  </Wrapper>
);

export default ImagePlaceholder;
