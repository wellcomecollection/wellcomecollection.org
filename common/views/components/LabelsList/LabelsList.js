// @flow
import type { Label as LabelType } from '../../../model/labels';
import { sized } from '../../../utils/style';
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
    className={`flex-inline plain-list no-margin no-padding padding-right-12`}
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
