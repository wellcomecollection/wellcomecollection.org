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
  className: font('sans', -1),
  $v: {
    size: 'md',
    properties: props.$removeBottomPadding
      ? ['padding-top']
      : ['padding-top', 'padding-bottom'],
  },
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
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
    className: font('brand-bold', 1),
    $v: {
      size: 'sm',
      properties: props.$addBottomPadding ? ['padding-bottom'] : [],
    },
  })
)``;
