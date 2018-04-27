// @flow

import Icon from '../../Icon/Icon';

export type GenericButtonProps = {|
  text: string,
  url?: string,
  icon?: string,
  eventTracking?: string,
  id?: string,
  disabled?: boolean,
  clickHandler?: (event: Event) => void
|}

type Props = {|
  ...GenericButtonProps,
  extraClasses?: string
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
  return (
    <HtmlTag
      href={url}
      id={id}
      className={`btn ${extraClasses || ''} flex-inline flex--v-center`}
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
