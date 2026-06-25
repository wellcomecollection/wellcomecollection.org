import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';

export { ListItem } from '@weco/content/views/components/ScrollContainer/ScrollContainer.styles';

export const Title = styled.h2.attrs<{
  $headingLevel: 2 | 3;
  $fontFamily: 'brand-bold' | 'sans-bold';
}>(props => ({
  className:
    props.$fontFamily === 'brand-bold'
      ? props.$headingLevel === 2
        ? typography('heading', 'xl', 'strong', 'brand')
        : typography('heading', 'lg', 'strong', 'brand')
      : props.$headingLevel === 2
        ? typography('heading', 'xl', 'strong', 'sans')
        : typography('body', 'xl', 'strong'),
  as: props.$headingLevel === 2 ? 'h2' : 'h3',
}))<{ $hasDescriptionSibling: boolean }>`
  ${props =>
    props.$hasDescriptionSibling &&
    props.theme.makeSpacePropertyValues('xs', ['margin-bottom'])};
`;

export const Description = styled.p`
  color: ${props => props.theme.color('black')};
`;
