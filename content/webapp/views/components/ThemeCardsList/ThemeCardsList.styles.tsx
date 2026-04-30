import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';

export { ListItem } from '@weco/content/views/components/ScrollContainer/ScrollContainer.styles';

export const Title = styled.h2.attrs<{
  $headingLevel: 2 | 3;
  $fontFamily: 'brand-bold' | 'sans-bold';
}>(props => ({
  className: font(props.$fontFamily, props.$headingLevel === 2 ? 2 : 1),
  as: props.$headingLevel === 2 ? 'h2' : 'h3',
}))<{ $hasDescriptionSibling: boolean }>`
  ${props =>
    props.$hasDescriptionSibling
      ? props.theme.makeSpacePropertyValues('xs', ['margin-bottom'])
      : 'margin-bottom: 0'};
`;

export const Description = styled.p`
  color: ${props => props.theme.color('black')};
  margin-bottom: 0;
`;
