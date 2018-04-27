// @flow
import Button from '../Button/Button';
import type {GenericButtonProps} from '../Button/Button';
import {font} from '../../../../utils/classnames';

const TertiaryButton = ({
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
      extraClasses={`btn--tertiary ${font({s: 'HNM5'})}`} />
  );
};

export default TertiaryButton;
