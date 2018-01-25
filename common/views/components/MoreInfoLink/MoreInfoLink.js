import {spacing, font} from '../../../utils/classnames';
import Icon from '../Icon/Icon';

type Props = {|
  url: string,
  name: string
|}

const MoreInfoLink = ({url, name}: Props) => (
  <a className={[
    'flex-inline',
    'flex-v-center',
    'plain-link',
    'font-elf-green',
    'font-hover-mint',
    font({s: 'HNM4'})].join(' ')} href={url}>
    <span className='width-1-em'>
      <Icon name='arrow' extraClasses={['icon--elf-green']} />
    </span>
    <span className={spacing({s: 1}, {margin: ['left']})}>{name}</span>
  </a>
);

export default MoreInfoLink;
