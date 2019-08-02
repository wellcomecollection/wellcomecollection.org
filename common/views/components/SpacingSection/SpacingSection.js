// @flow

import type { Node } from 'react';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  children: Node,
|};

const SpacingSection = ({ children }: Props) => {
  return (
    <VerticalSpace v={{ size: 'xl', properties: ['padding-bottom'] }}>
      {children}
    </VerticalSpace>
  );
};

export default SpacingSection;
