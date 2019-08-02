// @flow

import type { Node } from 'react';
import Space from '../styled/Space';

type Props = {|
  children: Node,
|};

const SpacingSection = ({ children }: Props) => {
  return (
    <Space v={{ size: 'xl', properties: ['padding-bottom'] }}>{children}</Space>
  );
};

export default SpacingSection;
