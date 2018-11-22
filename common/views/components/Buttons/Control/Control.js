// @flow
import Icon from '../../Icon/Icon';
import type {GaEvent} from '../../../../utils/ga';

type Props = {|
  url?: string,
  id?: string,
  type: 'light' | 'dark',
  extraClasses?: string,
  icon: string,
  text: string,
  trackingEvent?: GaEvent,
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
  trackingEvent,
  disabled,
  clickHandler
}: Props) => {
  const attrs = {
    id: id,
    href: url,
    className: `control control--${type} ${extraClasses || ''}`,
    'data-track-event': trackingEvent && JSON.stringify(trackingEvent),
    disabled: disabled,
    onClick: clickHandler
  };

  return url
    ? <a {...attrs}><InnerControl text={text} icon={icon} /></a>
    : <button {...attrs}><InnerControl text={text} icon={icon} /></button>;
};

export default Control;
