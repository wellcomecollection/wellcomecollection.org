import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { grid, font } from '@weco/common/utils/classnames';

export const Container = styled(Space).attrs({
  v: { size: 'xl', properties: ['margin-bottom'] },
})`
  background-color: white;
  border: 1px solid ${props => props.theme.color('pumice')};
  border-radius: 10px;
`;

type WrapperProps = {
  removeBottomPadding?: boolean;
};

export const Wrapper = styled(Space).attrs<WrapperProps>(props => ({
  v: {
    size: 'l',
    properties: props.removeBottomPadding
      ? ['padding-top']
      : ['padding-top', 'padding-bottom'],
  },
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
}))<WrapperProps>`
  position: relative;
`;

export const Header = styled(Space)`
  background: ${props => props.theme.color('white')};
`;

export const Title = styled.h1.attrs({ className: font('wb', 0) })``;

export const SectionHeading = styled(Space).attrs({
  as: 'h2',
  v: { size: 'm', properties: ['padding-bottom'] },
  className: font('wb', 3),
})`
  font-weight: bold;
`;

export const Intro = styled(Space).attrs({
  as: 'p',
  className: grid({ s: 12, m: 12, l: 8, xl: 8 }),
})`
  padding-left: 0;
`;
