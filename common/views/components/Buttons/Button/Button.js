// @flow

import {font} from '../../../../utils/classnames';
import Icon from '../../Icon/Icon';

type Props = {|
  url?: string,
  extraClasses?: string,
  icon?: string,
  text: string,
  eventTracking?: string,
  id?: string,
  disabled?: boolean,
  clickHandler?: (event: Event) => void
|}

const Button = ({
  url,
  id,
  extraClasses,
  icon,
  text,
  eventTracking,
  disabled,
  clickHandler
}: Props) => {
  const HtmlTag = url ? 'a' : 'button';
  const fontClasses = extraClasses && extraClasses.indexOf('btn--tertiary') > -1
    ? {s: 'HNM5'}
    : {s: 'HNM4'};
  return (
    <HtmlTag
      href={url}
      id={id}
      className={`btn ${extraClasses || ''} ${font(fontClasses)} flex-inline flex--v-center`}
      data-track-event={eventTracking}
      onClick={clickHandler}
      disabled={disabled}>
      <span className='flex-inline flex--v-center'>
        {icon && <Icon name={icon} />}
        <span className='btn__text'>{text}</span>
      </span>
    </HtmlTag>
  );
};

export default Button;
