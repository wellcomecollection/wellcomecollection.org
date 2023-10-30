import React, { useState } from 'react';
import styled from 'styled-components';
import WellcomeTextInput from '@weco/common/views/components/TextInput/TextInput';
import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import Icon from '@weco/common/views/components/Icon/Icon';
import { a11YVisual, eye } from '@weco/common/icons';

const PasswordInputContainer = styled.div`
  display: flex;

  & > div {
    width: 100%;
    margin-right: 1em;
  }
`;

const VisibilityButton = styled(SolidButton).attrs(props => ({
  type: 'button',
  $colors: props.theme.buttonColors.greenTransparentGreen,
}))`
  height: 55px;
`;

type PasswordInputProps = React.ComponentPropsWithRef<typeof WellcomeTextInput>;

export const PasswordInput: React.FunctionComponent<
  PasswordInputProps
> = props => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleIsVisible = () => setIsVisible(wasVisible => !wasVisible);

  return (
    <PasswordInputContainer>
      <WellcomeTextInput {...props} type={isVisible ? 'text' : 'password'} />
      <VisibilityButton onClick={toggleIsVisible}>
        <Icon icon={isVisible ? a11YVisual : eye} />
      </VisibilityButton>
    </PasswordInputContainer>
  );
};
