// @flow
import {sized} from '../../../utils/style';
import {spacing} from '../../../utils/classnames';
import Label from '../../components/Label/Label';

type Props = {|
  labels: {
    url: ?string,
    text: string
  }[]
|}

const LabelsList = ({labels}: Props) => (
  <ul className={`flex-inline plain-list no-margin ${spacing({s: 0}, {padding: ['top', 'bottom', 'left']})} ${spacing({s: 2}, {padding: ['right']})}`} style={{flexWrap: 'wrap'}}>
    {
      (labels.filter(Boolean).map((label, i) => (
        <li key={`${label.text}-${i}`} style={{float: 'left', marginRight: sized(0.5), marginTop: sized(0.5)}}>
          <Label label={label} />
        </li>
      )))
    }
  </ul>
);

export default LabelsList;
