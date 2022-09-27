import { font } from '@weco/common/utils/classnames';
import { ColorSelection } from '../../types/color-selections';
import Number from '@weco/common/views/components/Number/Number';
import { FunctionComponent, ReactElement } from 'react';

type Props = {
  number: number;
  color?: ColorSelection;
  description?: 'Part' | 'Episode';
};

const PartNumberIndicator: FunctionComponent<Props> = ({
  number,
  color,
  description = 'Part',
}: Props): ReactElement<Props> => (
  <div className={font('wb', 5)}>
    {description}
    <Number color={color} number={number} />
  </div>
);

export default PartNumberIndicator;
