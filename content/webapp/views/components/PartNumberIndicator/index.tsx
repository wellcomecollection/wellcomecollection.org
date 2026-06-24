import { ComponentPropsWithoutRef, FunctionComponent } from 'react';

import { typography } from '@weco/common/utils/classnames';
import Number from '@weco/content/views/components/Number';

type NumberProps = ComponentPropsWithoutRef<typeof Number>;

type Props = NumberProps & {
  description?: 'Part' | 'Episode';
};

const PartNumberIndicator: FunctionComponent<Props> = ({
  description = 'Part',
  ...numberProps
}) => (
  <div
    data-component="part-number-indicator"
    className={typography('heading', 'sm', 'strong', 'brand')}
  >
    {description}
    <Number {...numberProps} />
  </div>
);

export default PartNumberIndicator;
