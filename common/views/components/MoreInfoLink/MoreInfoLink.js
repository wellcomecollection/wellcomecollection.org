// @flow

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
    'font-green',
    'font-hover-cyan',
    font({s: 'HNM4'})].join(' ')} href={url} data-component="MoreInfoLink">
    <span className='width-1-em'>
      <Icon name='arrow' extraClasses='icon--green' />
    </span>
    <span className={spacing({s: 1}, {margin: ['left']})}>{name}</span>
  </a>
);

export default MoreInfoLink;
