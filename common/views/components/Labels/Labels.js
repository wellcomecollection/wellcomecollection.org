// @flow
import {font, spacing} from '../../../utils/classnames';

type Props = {|
  labels: string[]
|}

const Labels = ({labels}: Props): React.Node[] => {
  return (labels.filter(Boolean).map((text, i) => (
    <span key={`text-${i}`} className={`
      line-height-1 bg-yellow
      ${font({s: 'HNM5'})}
      ${spacing({s: 1}, {padding: ['top', 'bottom', 'left', 'right']})}
    `} style={{display: 'block', float: 'left', marginRight: '1px', marginTop: '1px', whiteSpace: 'nowrap'}}>
      {text}
    </span>
  ))
  );
};

export default Labels;
