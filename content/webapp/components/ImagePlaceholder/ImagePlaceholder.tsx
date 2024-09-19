import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { repeatingLs, transparentGif } from '@weco/common/utils/backgrounds';
import type { ColorSelection } from '@weco/content/types/color-selections';

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

export const placeholderBackgroundColor = (
  position: number
): ColorSelection => {
  switch (position % 4) {
    case 0:
      return 'accent.salmon';
    case 1:
      return 'accent.blue';
    case 2:
      return 'accent.purple';
    case 3:
    default:
      return 'accent.green';
  }
};

const ImagePlaceholder: FunctionComponent<Props> = ({ backgroundColor }) => (
  <Wrapper $backgroundColor={backgroundColor || 'accent.purple'}>
    <img src={transparentGif} alt="" width="1" height="1" />
    <Pattern />
  </Wrapper>
);

export default ImagePlaceholder;
