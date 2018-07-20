import {spacing} from '../../../utils/classnames';

type Props = {|
  text: string
|}

const HighlightedHeading = ({text}: Props) => {
  return (
    <h1 className='h1'>
      <span
        className={`highlighted-heading bg-white ${spacing({s: 2}, {padding: ['left', 'right']})} ${spacing({s: 1}, {padding: ['bottom', 'top']})}`}>
        {text}
      </span>
    </h1>
  );
};

export default HighlightedHeading;
