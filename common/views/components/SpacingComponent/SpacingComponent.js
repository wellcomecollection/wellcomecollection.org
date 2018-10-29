// @flow

import type {Node} from 'react';
import {classNames} from '../../../utils/classnames';

type Props = {|
  children: Node
|};

const SpacingComponent = ({ children }: Props) => {
  return (
    <div className={classNames({
      'spacing-component': true
    })}>
      {children}
    </div>
  );
};

export default SpacingComponent;
