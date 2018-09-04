import {spacing, font, classNames} from '../../../utils/classnames';

const FreeSticker = () => (
  <span className={classNames({
    'font-white bg-black rotate-r-8 absolute': true,
    [font({s: 'WB7'})]: true,
    [spacing({s: 1}, {padding: ['top', 'bottom']})]: true,
    [spacing({s: 2}, {padding: ['left', 'right']})]: true
  })}
  style={{marginTop: '-20px', right: '0'}}>Free</span>
);

export default FreeSticker;
