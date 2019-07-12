// @flow

import type { Node } from 'react';
import styled from 'styled-components';

// TODO: use spacings from theme
const SpacingComponentEl = styled.div.attrs({
  className: 'spacing-component',
})`
  &:empty,
  & + .spacing-component {
    margin-top: 16px;

    ${props => props.theme.media.medium`
      margin-top: 24px;
    `}

    ${props => props.theme.media.medium`
      margin-top: 32px;
    `}
  }
`;

type Props = {|
  children?: Node,
|};

const SpacingComponent = ({ children }: Props) => {
  return <SpacingComponentEl>{children}</SpacingComponentEl>;
};

export default SpacingComponent;
