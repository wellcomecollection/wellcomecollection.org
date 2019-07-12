import styled from 'styled-components';

const sizesAtBreakpoints = {
  small: {
    xs: 4,
    s: 6,
    m: 8,
    l: 16,
    xl: 30,
  },
  medium: {
    xs: 4,
    s: 6,
    m: 12,
    l: 24,
    xl: 46,
  },
  large: {
    xs: 4,
    s: 8,
    m: 16,
    l: 32,
    xl: 64,
  },
};

// TODO: use spacings from theme
const VerticalSpace = styled.div`
  margin-bottom: ${({ size }) =>
    (size === 'xs' && sizesAtBreakpoints.small.xs) ||
    (size === 's' && sizesAtBreakpoints.small.s) ||
    (size === 'm' && sizesAtBreakpoints.small.m) ||
    (size === 'l' && sizesAtBreakpoints.small.l) ||
    (size === 'xl' && sizesAtBreakpoints.small.xl) ||
    0};

  ${props => props.theme.media.medium`
    margin-bottom: ${({ size }) =>
      (size === 'xs' && sizesAtBreakpoints.medium.xs) ||
      (size === 's' && sizesAtBreakpoints.medium.s) ||
      (size === 'm' && sizesAtBreakpoints.medium.m) ||
      (size === 'l' && sizesAtBreakpoints.medium.l) ||
      (size === 'xl' && sizesAtBreakpoints.medium.xl) ||
      0};
  `}

  ${props => props.theme.media.large`
    margin-bottom: ${({ size }) =>
      (size === 'xs' && sizesAtBreakpoints.large.xs) ||
      (size === 's' && sizesAtBreakpoints.large.s) ||
      (size === 'm' && sizesAtBreakpoints.large.m) ||
      (size === 'l' && sizesAtBreakpoints.large.l) ||
      (size === 'xl' && sizesAtBreakpoints.large.xl) ||
      0};
  `}
`;

export default VerticalSpace;
