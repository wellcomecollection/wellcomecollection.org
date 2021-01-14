import { classNames, font } from '../../../utils/classnames';
import { ColorSelection } from '../../../model/color-selections';
import Number from '@weco/common/views/components/Number/Number';
import { FunctionComponent, ReactElement } from 'react';

type Props = {
  number: number;
  color?: ColorSelection;
  isPodcast?: boolean;
};

const PartNumberIndicator: FunctionComponent<Props> = ({
  number,
  color,
  isPodcast = false,
}: Props): ReactElement<Props> => (
  <div
    className={classNames({
      [font('wb', 5)]: true,
    })}
  >
    {isPodcast ? 'Episode' : 'Part'}
    <Number color={color} number={number} />
  </div>
);

export default PartNumberIndicator;
