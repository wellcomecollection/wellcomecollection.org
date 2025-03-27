import styled from 'styled-components';

import { font, grid } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const Container = styled(Space).attrs({
  $v: { size: 'xl', properties: ['margin-bottom'] },
})`
  background-color: white;
  border: 1px solid ${props => props.theme.color('warmNeutral.400')};
  border-radius: 10px;
`;

type WrapperProps = {
  $removeBottomPadding?: boolean;
};

export const Wrapper = styled(Space).attrs<WrapperProps>(props => ({
  className: font('intr', 5),
  $v: {
    size: 'l',
    properties: props.$removeBottomPadding
      ? ['padding-top']
      : ['padding-top', 'padding-bottom'],
  },
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
}))<WrapperProps>`
  position: relative;
`;

export const Header = styled(Space)`
  background: ${props => props.theme.color('white')};
`;

export const Title = styled.h1.attrs({ className: font('wb', 0) })``;

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
)<SectionHeadingProps>`
  font-weight: bold;
`;

export const Intro = styled(Space).attrs({
  as: 'p',
  className: grid({
    s: ['auto', 12],
    m: ['auto', 12],
    l: ['auto', 8],
    xl: ['auto', 8],
  }),
})`
  padding-left: 0;
`;
