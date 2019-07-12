// @flow

import type { Node } from 'react';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  children: Node,
|};

const SpacingSection = ({ children }: Props) => {
  return <VerticalSpace size="xl">{children}</VerticalSpace>;
};

export default SpacingSection;
