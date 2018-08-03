// @flow
import {sized} from '../../../utils/style';
import Label from '../../components/Label/Label';

type Props = {|
  labels: {
    url: ?string,
    text: string
  }[],
  isSpaced?: boolean
|}

const LabelsList = ({labels, isSpaced = false}: Props) => (
  <ul className='plain-list no-padding no-margin'>
    {
      (labels.filter(Boolean).map((label, i) => (
        <li key={`${label.text}-${i}`} style={{float: 'left', marginRight: isSpaced ? sized(1) : '1px', marginTop: isSpaced ? sized(1) : '1px'}}>
          <Label label={label} />
        </li>
      )))
    }
  </ul>
);

export default LabelsList;
