// @flow
import {font} from '../../../../utils/classnames';
import Icon from '../../Icon/Icon';

type Props = {|
  text: string,
  id?: string,
  extraClasses?: string,
  icon?: string,
  eventTracking?: string
|}

const ButtonButton = ({id, extraClasses, icon, text, eventTracking}: Props) => (
  <button
    id={id}
    className={`btn ${extraClasses || ''} ${font({s: 'HNM5'})}`}
    data-track-event={eventTracking}>
    {icon && <Icon name={icon} />}
    <span className='btn__text'>{text}</span>
  </button>
);

export default ButtonButton;
