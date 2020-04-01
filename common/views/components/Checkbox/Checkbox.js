// @flow

import { useContext } from 'react';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import { AppContext } from '../AppContext/AppContext';

const CheckboxLabel = styled.label.attrs({
  className: classNames({
    'flex-inline flex--v-center': true,
  }),
})``;

const CheckboxBox = styled.span.attrs({
  className: classNames({
    'flex-inline flex--v-center flex--h-center relative': true,
  }),
})`
  width: 1.2em;
  height: 1.2em;
  border: 2px solid ${props => props.theme.colors.pumice};
  transition: all 400ms ease;

  .icon {
    position: absolute;
    opacity: 0;
    transition: opacity 400ms ease;
  }
`;

const CheckboxInput = styled.input.attrs({
  type: 'checkbox',
})`
  position: absolute;
  opacity: 0;
  z-index: 1;
  width: 1em;
  height: 1em;

  &:checked ~ ${CheckboxBox} {
    border-color: ${props => props.theme.colors.black};

    .icon {
      opacity: 1;
    }
  }

  &:focus ~ ${CheckboxBox} {
    border-color: ${props => !props.hideFocus && props.theme.colors.black};
  }
`;

type CheckboxProps = {|
  id: string,
  text: string,
  checked: boolean,
  name: string,
  onChange: (SyntheticEvent<HTMLInputElement>) => void,
  value: string,
|};

function Checkbox({ id, text, ...inputProps }: CheckboxProps) {
  const { isKeyboard } = useContext(AppContext);

  return (
    <CheckboxLabel htmlFor={id}>
      <CheckboxInput id={id} {...inputProps} hideFocus={!isKeyboard} />
      <CheckboxBox>
        <Icon name="check" extraClasses={`icon--match-text`} />
      </CheckboxBox>
      <Space as="span" h={{ size: 'xs', properties: ['margin-left'] }}>
        {text}
      </Space>
    </CheckboxLabel>
  );
}

export default Checkbox;
