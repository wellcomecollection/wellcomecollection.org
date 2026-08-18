import { PropsWithChildren } from 'react';
import styled, { DefaultTheme } from 'styled-components';

import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';

type SpaceSize = Parameters<DefaultTheme['makeSpacePropertyValues']>[0];

// The shared "coloured hero band + decorative edge" shell used by both
// CollectionsHeader and concept.Header - bottom padding is left to callers
// (via `paddingBottomCss`) since it differs slightly between the two.
const Band = styled(Space)<{
  $backgroundColor: PaletteColor;
  $paddingBottomCss?: (theme: DefaultTheme) => string;
}>`
  background-color: ${props => props.theme.color(props.$backgroundColor)};
  ${props => props.$paddingBottomCss?.(props.theme)}
`;

export type Props = PropsWithChildren<{
  backgroundColor?: PaletteColor;
  paddingTopSize?: SpaceSize;
  paddingBottomCss?: (theme: DefaultTheme) => string;
  decorativeEdgeColor?: PaletteColor;
}>;

const HeaderColourBand = ({
  backgroundColor = 'accent.lightGreen',
  paddingTopSize = 'sm',
  paddingBottomCss,
  decorativeEdgeColor = 'white',
  children,
}: Props) => {
  return (
    <>
      <Band
        data-component="header-colour-band"
        $backgroundColor={backgroundColor}
        $paddingBottomCss={paddingBottomCss}
        $v={{ size: paddingTopSize, properties: ['padding-top'] }}
      >
        <Container>{children}</Container>
      </Band>

      <DecorativeEdge variant="wobbly" backgroundColor={decorativeEdgeColor} />
    </>
  );
};

export default HeaderColourBand;
