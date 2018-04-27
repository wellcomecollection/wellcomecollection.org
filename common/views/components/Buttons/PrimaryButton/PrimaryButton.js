// @flow
import Button from '../Button/Button';
import type {GenericButtonProps} from '../Button/Button';
import {font} from '../../../../utils/classnames';

const PrimaryButton = ({
  url,
  id,
  icon,
  text,
  eventTracking,
  disabled,
  clickHandler
}: GenericButtonProps) => {
  return (
    <Button
      url={url}
      id={id}
      icon={icon}
      text={text}
      eventTracking={eventTracking}
      disabled={disabled}
      clickHandler={clickHandler}
      extraClasses={`btn--primary ${font({s: 'HNM4'})}`} />
  );
};

export default PrimaryButton;
