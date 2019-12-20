// @flow

import React from 'react';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';

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
  border: 2px solid ${props => props.theme.colors.silver};
  border-radius: 3px;
  transition: all 400ms ease;

  &:after {
    content: '';
    position: absolute;
    width: 60%;
    height: 60%;
    opacity: 0;
    transition: opacity 400ms ease;
    background: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2032%2032%22%3E%0A%20%20%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M6%2012l-6%206%2012%2012%2020-20-6-6-14%2014z%22%3E%3C/path%3E%0A%3C/svg%3E%0A');
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
    background: ${props => props.theme.colors.green};
    border-color: ${props => props.theme.colors.green};

    &:after {
      opacity: 1;
    }
  }

  &:focus ~ ${CheckboxBox} {
    border-color: ${props => props.theme.colors.black};
  }

  ~ span {
    color: ${props => props.theme.colors.silver};
  }

  &:focus ~ span,
  &:checked ~ span {
    color: ${props => props.theme.colors.black};
  }
`;

type CheckboxWithoutLabelProps = {|
  id: string,
|};
type CheckboxProps = {|
  ...CheckboxWithoutLabelProps,
  text: string,
  checked: boolean,
  name: string,
  onChange: ?() => void,
  value: ?string,
|};

function Checkbox({ id, text, ...inputProps }: CheckboxProps) {
  return (
    <CheckboxLabel htmlFor={id}>
      <CheckboxInput id={id} {...inputProps} />
      <CheckboxBox />
      <Space as="span" h={{ size: 'xs', properties: ['margin-left'] }}>
        {text}
      </Space>
    </CheckboxLabel>
  );
}

export default Checkbox;
