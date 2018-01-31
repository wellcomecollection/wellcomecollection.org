// @flow

import {font} from '../../../utils/classnames';
import Icon from '../Icon/Icon';

type Props = {
  extraClasses?: string,
  icon?: any, // TODO: use Icon type?
  text: string,
  eventTracking?: string
}

const ButtonButton = ({extraClasses, icon, text, eventTracking}: Props) => (
  <button className={`btn ${extraClasses} ${font({s: 'HNM5'})}`}
    data-track-event={eventTracking}>
    {icon && <Icon name={icon} />}
    <span className='btn__text'>{text}</span>
  </button>
);

return ButtonButton;
