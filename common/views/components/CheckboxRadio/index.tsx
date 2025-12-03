import {
  FunctionComponent,
  ReactElement,
  ReactNode,
  SyntheticEvent,
} from 'react';
import styled from 'styled-components';

import { check, indicator } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { focusStyle } from '@weco/common/views/themes/base/wellcome-normalize';

const CheckboxRadioLabel = styled.label<{ $isDisabled?: boolean }>`
  display: inline-flex;
  align-items: flex-start;
  cursor: ${props => (props.$isDisabled ? ' not-allowed' : 'pointer')};
  padding: 4px 0;
`;

const CheckboxRadioBox = styled.span<{
  $type: string;
  $hasErrorBorder?: boolean;
  $isDisabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => (props.$isDisabled ? ' not-allowed' : 'pointer')};

  position: relative;
  width: 1.3em;
  height: 1.3em;
  border: 1px solid ${props => props.theme.color('black')};
  border-radius: ${props => (props.$type === 'radio' ? '50%' : '0')};
  ${props => (props.$hasErrorBorder ? `border-color: red;` : ``)}

  ${props =>
    props.$isDisabled
      ? `background-color: ${props.theme.color('neutral.300')};
      border-color: ${props.theme.color('neutral.400')};`
      : ''}


  .icon {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
  }
`;

const CheckboxRadioInput = styled.input.attrs<{ $type: string }>(props => ({
  type: props.$type === 'checkbox' ? 'checkbox' : 'radio',
}))<{ disabled?: boolean }>`
  position: absolute;
  opacity: 0;
  z-index: 1;
  width: 1em;
  height: 1em;
  cursor: ${props => (props.disabled ? ' not-allowed' : 'pointer')};

  &:checked ~ ${CheckboxRadioBox} {
    .icon {
      opacity: 1;
    }
  }

  &:hover ~ ${CheckboxRadioBox} {
    border-width: ${props => (props.disabled ? '1px' : '2px')};
  }

  &:focus-visible ~ ${CheckboxRadioBox}, &:focus ~ ${CheckboxRadioBox} {
    ${focusStyle};
  }

  &:focus ~ ${CheckboxRadioBox}:not(:focus-visible ~ ${CheckboxRadioBox}) {
    box-shadow: none;
  }
`;

const CheckBoxWrapper = styled.div`
  display: inline-flex;
  position: relative;
  top: 1px;
`;

const CheckboxLabel = styled.span<{ $isDisabled?: boolean }>`
  ${props =>
    props.$isDisabled
      ? `color: ${props.theme.color('neutral.600')}`
      : 'inherit'}
`;

type CheckboxRadioProps = {
  type: 'checkbox' | 'radio';
  id?: string;
  text: ReactNode;
  checked: boolean;
  name?: string;
  onChange: (event: SyntheticEvent<HTMLInputElement>) => void;
  value?: string;
  disabled?: boolean;
  ariaLabel?: string;
  form?: string;
  hasErrorBorder?: boolean;
};

const CheckboxRadio: FunctionComponent<CheckboxRadioProps> = ({
  id,
  text,
  type,
  ariaLabel,
  hasErrorBorder,
  disabled,
  ...inputProps
}: CheckboxRadioProps): ReactElement<CheckboxRadioProps> => {
  return (
    <CheckboxRadioLabel
      data-component="checkbox-radio"
      htmlFor={id}
      $isDisabled={disabled}
    >
      <CheckBoxWrapper>
        <CheckboxRadioInput
          id={id}
          $type={type}
          disabled={disabled}
          {...inputProps}
        />
        <CheckboxRadioBox
          $type={type}
          $hasErrorBorder={hasErrorBorder}
          $isDisabled={disabled}
        >
          <Icon icon={type === 'checkbox' ? check : indicator} />
        </CheckboxRadioBox>
      </CheckBoxWrapper>
      <Space $h={{ size: 's', properties: ['margin-left'] }}>
        <CheckboxLabel $isDisabled={disabled}>{text}</CheckboxLabel>
      </Space>
    </CheckboxRadioLabel>
  );
};

export default CheckboxRadio;
