// @flow

import {font} from '../../../../utils/classnames';
import Icon from '../../Icon/Icon';

type Props = {|
  extraClasses?: string,
  url: string,
  icon?: string,
  text: string,
  eventTracking?: string,
  id?: string,
  disabled?: boolean
|}

const LinkButton = ({
  id,
  url,
  extraClasses,
  icon,
  text,
  eventTracking,
  disabled
}: Props) => {
  const fontClasses = extraClasses && extraClasses.indexOf('btn--tertiary') > -1
    ? {s: 'HNM5'}
    : {s: 'HNM4'};
  return (
    <a
      id={id}
      href={url}
      className={`btn ${extraClasses || ''} ${font(fontClasses)} flex-inline flex--v-center`}
      data-track-event={eventTracking}
      disabled={disabled}
      aria-diabled={disabled}>
      {icon && <Icon name={icon}/>}
      <span className='btn__text'>{text}</span>
    </a>
  );
};

export default LinkButton;
