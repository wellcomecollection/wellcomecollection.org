// @flow
import NextLink from 'next/link';
import Icon from '../../Icon/Icon';

type Props = {|
  url?: string,
  id?: string,
  type: 'light' | 'dark',
  extraClasses?: string,
  icon: string,
  text: string,
  eventTracking?: string,
  disabled?: boolean,
  clickHandler?: (event: Event) => void
|}

type InnerControlProps = { text: string, icon: string };
const InnerControl = ({ text, icon }: InnerControlProps) => (
  <span className='control__inner flex-inline flex--v-center flex--h-center'>
    <Icon name={icon} />
    <span className='visually-hidden'>{text}</span>
  </span>
);

const Control = ({
  url,
  id,
  type,
  extraClasses,
  icon,
  text,
  eventTracking,
  disabled,
  clickHandler
}: Props) => {
  const attrs = {
    id: id,
    className: `control control--${type} ${extraClasses || ''}`,
    'data-track-event': eventTracking,
    disabled: disabled,
    onClick: clickHandler
  };

  return url
    ? <NextLink href={url}><a {...attrs}><InnerControl text={text} icon={icon} /></a></NextLink>
    : <button {...attrs}><InnerControl text={text} icon={icon} /></button>;
};

export default Control;
