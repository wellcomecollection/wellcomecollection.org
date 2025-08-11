import { FunctionComponent } from 'react';
import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';

import Dot from './TextWithDot.Dot';

const Wrapper = styled.span`
  display: flex;
  align-items: center;
`;

const DotWrapper = styled(Space).attrs({
  as: 'span',
  $h: { size: 'xs', properties: ['margin-right'] },
})``;

type Props = { dotColor: PaletteColor; text: string; className?: string };

const TextWithDot: FunctionComponent<Props> = ({
  dotColor,
  text,
  className,
}) => (
  <Wrapper data-component="text-with-dot" className={className}>
    <DotWrapper>
      <Dot $dotColor={dotColor} />
    </DotWrapper>
    {text}
  </Wrapper>
);

export default TextWithDot;
