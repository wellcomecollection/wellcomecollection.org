import { ComponentPropsWithoutRef, FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
import Number from '@weco/content/views/components/Number';

type NumberProps = ComponentPropsWithoutRef<typeof Number>;

type Props = NumberProps & {
  description?: 'Part' | 'Episode';
};

const PartNumberIndicator: FunctionComponent<Props> = ({
  description = 'Part',
  ...numberProps
}) => (
  <div className={font('wb', 5)}>
    {description}
    <Number {...numberProps} />
  </div>
);

export default PartNumberIndicator;
