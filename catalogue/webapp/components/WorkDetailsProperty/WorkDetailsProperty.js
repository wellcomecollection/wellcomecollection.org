// @flow
import { type Node } from 'react';
import { font } from '@weco/common/utils/classnames';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

type Props = {| title: ?string, children: Node |};

const WorkDetailsProperty = ({ title, children }: Props) => {
  return (
    <SpacingComponent>
      <div className={`${font('hnl', 5)}`}>
        {title && <h3 className={`${font('hnm', 5)} no-margin`}>{title}</h3>}
        {children}
      </div>
    </SpacingComponent>
  );
};

export default WorkDetailsProperty;
