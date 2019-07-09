import styled from 'styled-components';

const VerticalSpace = styled.div`
  margin-bottom: ${({ size }) =>
    (size === 'xs' && '4px') ||
    (size === 's' && '6px') ||
    (size === 'm' && '8px') ||
    (size === 'l' && '16px') ||
    (size === 'xl' && '30px') ||
    0};

  ${props => props.theme.media.medium`
    margin-bottom: ${({ size }) =>
      (size === 'xs' && '4px') ||
      (size === 's' && '6px') ||
      (size === 'm' && '12px') ||
      (size === 'l' && '24px') ||
      (size === 'xl' && '46px') ||
      0};
  `}

  ${props => props.theme.media.large`
    margin-bottom: ${({ size }) =>
      (size === 'xs' && '4px') ||
      (size === 's' && '8px') ||
      (size === 'm' && '16px') ||
      (size === 'l' && '32px') ||
      (size === 'xl' && '64px') ||
      0};
  `}
`;

export default VerticalSpace;
