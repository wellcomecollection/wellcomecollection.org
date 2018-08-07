// @flow
import {font, spacing} from '../../../utils/classnames';
import {sized} from '../../../utils/style';

type Props = {|
  labels: string[],
  isSpaced?: boolean
|}

const Labels = ({labels, isSpaced = false}: Props): React.Node[] => {
  return (labels.filter(Boolean).map((text, i) => (
    <span key={`text-${i}`} className={`
      line-height-1 bg-yellow
      ${font({s: 'HNM5'})}
      ${spacing({s: 1}, {padding: ['top', 'bottom', 'left', 'right']})}
    `} style={{float: 'left', marginRight: isSpaced ? sized(1) : '1px', marginTop: isSpaced ? sized(1) : '1px', whiteSpace: 'nowrap'}}>
      {text}
    </span>
  ))
  );
};

export default Labels;
