// @flow

import Icon from '../../Icon/Icon';

type Props = {|
  id?: string,
  extraClasses?: string,
  icon: string,
  text: string,
  eventTracking?: string,
  disabled?: boolean,
  clickHandler?: (event: Event) => void
|}

const ButtonControl = ({
  id,
  extraClasses,
  icon,
  text,
  eventTracking,
  disabled,
  clickHandler
}: Props) => {
  return (
    <button
      id={id}
      className={`button-control ${extraClasses || ''}`}
      data-track-event={eventTracking}
      disabled={disabled}
      onClick={clickHandler}>
      <span className='button-control__inner flex-inline flex--v-center flex--h-center'>
        <Icon name={icon} />
        <span className='visually-hidden'>{text}</span>
      </span>
    </button>
  );
};

export default ButtonControl;
