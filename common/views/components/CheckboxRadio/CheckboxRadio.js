// @flow

import { useContext } from 'react';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import { AppContext } from '../AppContext/AppContext';

const CheckboxRadioLabel = styled.label.attrs({
  className: classNames({
    'flex-inline flex--v-center': true,
  }),
})`
  cursor: pointer;
`;

const CheckboxRadioBox = styled.span.attrs({
  className: classNames({
    'flex-inline flex--v-center flex--h-center relative': true,
  }),
})`
  width: 1.3em;
  height: 1.3em;
  border: 2px solid ${props => props.theme.colors.pumice};
  border-radius: ${props => (props.type === 'radio' ? '50%' : '0')};
  transition: all 400ms ease;

  .icon {
    position: absolute;
    opacity: 0;
    transition: opacity 400ms ease;
  }
`;

const CheckboxRadioInput = styled.input.attrs(props => ({
  type: props.type === 'checkbox' ? 'checkbox' : 'radio',
}))`
  position: absolute;
  opacity: 0;
  z-index: 1;
  width: 1em;
  height: 1em;

  &:checked ~ ${CheckboxRadioBox} {
    border-color: ${props => props.theme.colors.black};

    .icon {
      opacity: 1;
    }
  }

  &:hover ~ ${CheckboxRadioBox} {
    border-color: ${props => props.theme.colors.black};
  }

  .is-keyboard & {
    &:focus ~ ${CheckboxRadioBox} {
      outline: 0;
      box-shadow: ${props => props.theme.focusBoxShadow};
      border-color: ${props => props.theme.colors.black};
    }
  }
`;

type CheckboxRadioProps = {|
  type: 'checkbox' | 'radio',
  id: string,
  text: string,
  checked: boolean,
  name: string,
  onChange: (SyntheticEvent<HTMLInputElement>) => void,
  value: string,
|};

function CheckboxRadio({ id, text, type, ...inputProps }: CheckboxRadioProps) {
  const { isKeyboard } = useContext(AppContext);

  return (
    <CheckboxRadioLabel htmlFor={id}>
      <CheckboxRadioInput
        id={id}
        type={type}
        {...inputProps}
        hideFocus={!isKeyboard}
      />
      <CheckboxRadioBox type={type}>
        <Icon
          name={type === 'checkbox' ? 'check' : 'indicator'}
          extraClasses={`icon--match-text`}
        />
      </CheckboxRadioBox>
      <Space as="span" h={{ size: 'xs', properties: ['margin-left'] }}>
        {text}
      </Space>
    </CheckboxRadioLabel>
  );
}

export default CheckboxRadio;
