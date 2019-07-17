// @flow
import type { Label as LabelType } from '../../../model/labels';
import { sized } from '../../../utils/style';
import { spacing } from '../../../utils/classnames';
import Label from '../../components/Label/Label';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  labels: LabelType[],
|};

const LabelsList = ({ labels }: Props) => (
  <VerticalSpace
    size="xs"
    properties={['margin-bottom']}
    negative
    as="ul"
    className={`flex-inline plain-list no-margin ${spacing(
      { s: 0 },
      { padding: ['left'] }
    )} ${spacing({ s: 2 }, { padding: ['right'] })}`}
    style={{ flexWrap: 'wrap' }}
  >
    {labels.filter(Boolean).map((label, i) => (
      <VerticalSpace
        size="xs"
        as="li"
        key={`${label.text}-${i}`}
        style={{
          float: 'left',
          marginRight: sized(0.5),
        }}
      >
        <Label label={label} />
      </VerticalSpace>
    ))}
  </VerticalSpace>
);

export default LabelsList;
