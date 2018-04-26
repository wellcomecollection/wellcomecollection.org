// @flow

import Icon from '../../Icon/Icon';

type Props = {|
  url?: string,
  id?: string,
  extraClasses?: string,
  icon: string,
  text: string,
  eventTracking?: string,
  disabled?: boolean,
  clickHandler?: (event: Event) => void
|}

const Control = ({
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
  return (
    <HtmlTag
      id={id}
      url={url}
      className={`button-control ${extraClasses || ''}`}
      data-track-event={eventTracking}
      disabled={disabled}
      onClick={clickHandler}>
      <span className='button-control__inner flex-inline flex--v-center flex--h-center'>
        <Icon name={icon} />
        <span className='visually-hidden'>{text}</span>
      </span>
    </HtmlTag>
  );
};

export default Control;
