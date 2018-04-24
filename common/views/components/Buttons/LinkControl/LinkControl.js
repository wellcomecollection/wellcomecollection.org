// @flow

import Icon from '../../Icon/Icon';

type Props = {|
  id?: string,
  url: string,
  extraClasses?: string,
  icon: string,
  text: string,
  eventTracking?: string,
  disabled?: boolean
|}

const LinkControl = ({
  id,
  url,
  extraClasses,
  icon,
  text,
  eventTracking,
  disabled
}: Props) => {
  return (
    <a
      id={id}
      href={url}
      className={`button-control ${extraClasses || ''}`}
      data-track-event={eventTracking}
      disabled={disabled}>
      <span className='button-control__inner flex-inline flex--v-center flex--h-center'>
        <Icon name={icon} />
        <span className='visually-hidden'>{text}</span>
      </span>
    </a>
  );
};

export default LinkControl;
