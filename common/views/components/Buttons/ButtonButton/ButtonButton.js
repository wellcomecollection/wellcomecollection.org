// @flow

import {font} from '../../../../utils/classnames';
import Icon from '../../Icon/Icon';

type Props = {|
  extraClasses?: string,
  icon?: string,
  text: string,
  eventTracking?: string,
  id?: string,
  clickHandler?: Function
|}

const ButtonButton = ({id, extraClasses, icon, text, eventTracking, clickHandler}: Props) => (
  <button
    id={id}
    className={`btn ${extraClasses || ''} ${font({s: 'HNM5'})}`}
    data-track-event={eventTracking}
    onClick={clickHandler}>
    {icon && <Icon name={icon} />}
    <span className='btn__text'>{text}</span>
  </button>
);

export default ButtonButton;
