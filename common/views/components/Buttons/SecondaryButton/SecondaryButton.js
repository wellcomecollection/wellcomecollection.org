// @flow
import {Fragment} from 'react';
import Button from '../Button/Button';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import type {GenericButtonProps} from '../Button/Button';
import {font} from '../../../../utils/classnames';

type Props = {|
  ...GenericButtonProps,
  primaryButton: PrimaryButton
|}

const SecondaryButton = ({
  primaryButton,
  url,
  id,
  icon,
  text,
  eventTracking,
  disabled,
  clickHandler
}: Props) => {
  return (
    <Fragment>
      {primaryButton}
      <Button
        url={url}
        id={id}
        icon={icon}
        text={text}
        eventTracking={eventTracking}
        disabled={disabled}
        clickHandler={clickHandler}
        extraClasses={`btn--secondary ${font({s: 'HNM4'})}`} />
    </Fragment>
  );
};

export default SecondaryButton;
