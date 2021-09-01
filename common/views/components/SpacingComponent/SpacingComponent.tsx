import type { FC, ReactNode } from 'react';
import styled from 'styled-components';

const SpacingComponentEl = styled.div.attrs({
  className: 'spacing-component',
})`
  &:empty,
  & + .spacing-component {
    margin-top: ${props => props.theme.spaceAtBreakpoints.small.l}px;

    ${props => props.theme.media.medium`
      margin-top: ${props => props.theme.spaceAtBreakpoints.medium.l}px;
    `}

    ${props => props.theme.media.medium`
      margin-top: ${props => props.theme.spaceAtBreakpoints.large.l}px;
    `}
  }
`;

type Props = {
  children?: ReactNode;
};

const SpacingComponent: FC<Props> = ({ children }) => {
  return <SpacingComponentEl>{children}</SpacingComponentEl>;
};

export default SpacingComponent;
