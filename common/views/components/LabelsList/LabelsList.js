// @flow
import {font, spacing} from '../../../utils/classnames';
import {sized} from '../../../utils/style';

type Props = {|
  labels: {
    url: ?string,
    text: string
  }[],
  isSpaced?: boolean
|}

const LabelsList = ({labels, isSpaced = false}: Props): React.Node[] => {
  return (labels.filter(Boolean).map((label, i) => (
    <span key={`text-${i}`} className={`
      line-height-1 bg-yellow
      ${font({s: 'HNM5'})}
      ${spacing({s: 1}, {padding: ['top', 'bottom', 'left', 'right']})}
    `} style={{float: 'left', marginRight: isSpaced ? sized(1) : '1px', marginTop: isSpaced ? sized(1) : '1px', whiteSpace: 'nowrap'}}>
      {label.text}
    </span>
  ))
  );
};

export default LabelsList;
