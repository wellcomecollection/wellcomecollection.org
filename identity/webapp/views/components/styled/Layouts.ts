import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const Container = styled(Space).attrs({
  $v: { size: 'xl', properties: ['margin-bottom'] },
})`
  background-color: white;
  border: 1px solid ${props => props.theme.color('warmNeutral.400')};
  border-radius: 10px;
`;

export const Wrapper = styled(Space).attrs<{
  $removeBottomPadding?: boolean;
}>(props => ({
  className: font('intr', 5),
  $v: {
    size: 'l',
    properties: props.$removeBottomPadding
      ? ['padding-top']
      : ['padding-top', 'padding-bottom'],
  },
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
}))`
  position: relative;
`;

type SectionHeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  $addBottomPadding?: boolean;
};

export const SectionHeading = styled(Space).attrs<SectionHeadingProps>(
  props => ({
    as: props.as || 'h2',
    className: font('wb', 3),
    $v: {
      size: 'm',
      properties: props.$addBottomPadding ? ['padding-bottom'] : [],
    },
  })
)``;
