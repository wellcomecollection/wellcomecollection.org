// @flow

import type {Node} from 'react';
import {classNames} from '../../../utils/classnames';

type Props = {|
  children: Node
|};

const SpacingSection = ({ children }: Props) => {
  return (
    <div className={classNames({
      'spacing-section': true
    })}>
      {children}
    </div>
  );
};

export default SpacingSection;
