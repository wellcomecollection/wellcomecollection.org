import { font } from '@weco/common/utils/classnames';
import { ColorSelection } from '../../types/color-selections';
import Number from '@weco/common/views/components/Number/Number';
import { FunctionComponent, ReactElement } from 'react';

type Props = {
  number: number;
  backgroundColor?: ColorSelection;
  description?: 'Part' | 'Episode';
};

const PartNumberIndicator: FunctionComponent<Props> = ({
  number,
  backgroundColor,
  description = 'Part',
}: Props): ReactElement<Props> => (
  <div className={font('wb', 5)}>
    {description}
    <Number backgroundColor={backgroundColor} number={number} />
  </div>
);

export default PartNumberIndicator;
