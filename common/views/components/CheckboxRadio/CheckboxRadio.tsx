import {
  FunctionComponent,
  SyntheticEvent,
  ReactElement,
  ReactNode,
} from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import { check, indicator } from '@weco/common/icons';

const CheckboxRadioLabel = styled.label`
  display: inline-flex;
  align-items: flex-start;
  cursor: pointer;
`;

const CheckboxRadioBox = styled.span<{
  $type: string;
  $hasErrorBorder?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  position: relative;
  width: 1.3em;
  height: 1.3em;
  border: 1px solid ${props => props.theme.color('black')};
  border-radius: ${props => (props.$type === 'radio' ? '50%' : '0')};
  ${props => (props.$hasErrorBorder ? `border-color: red;` : ``)}

  .icon {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
  }
`;

const CheckboxRadioInput = styled.input.attrs<{ $type: string }>(props => ({
  type: props.$type === 'checkbox' ? 'checkbox' : 'radio',
}))`
  position: absolute;
  opacity: 0;
  z-index: 1;
  width: 1em;
  height: 1em;
  cursor: pointer;

  &:checked ~ ${CheckboxRadioBox} {
    .icon {
      opacity: 1;
    }
  }

  &:hover ~ ${CheckboxRadioBox} {
    border-width: 2px;
  }

  &:focus-visible ~ ${CheckboxRadioBox}, &:focus ~ ${CheckboxRadioBox} {
    box-shadow: ${props => props.theme.focusBoxShadow};
    outline: ${props => props.theme.highContrastOutlineFix};
  }

  &:focus ~ ${CheckboxRadioBox}:not(:focus-visible ~ ${CheckboxRadioBox}) {
    box-shadow: none;
  }
`;

const CheckBoxWrapper = styled.div`
  position: relative;
  top: 1px;
`;

type CheckboxRadioProps = {
  type: 'checkbox' | 'radio';
  id?: string;
  text: ReactNode;
  checked: boolean;
  name?: string;
  onChange: (event: SyntheticEvent<HTMLInputElement>) => void;
  value?: string;
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
  ...inputProps
}: CheckboxRadioProps): ReactElement<CheckboxRadioProps> => {
  return (
    <CheckboxRadioLabel htmlFor={id}>
      <CheckBoxWrapper>
        <CheckboxRadioInput id={id} $type={type} {...inputProps} />
        <CheckboxRadioBox $type={type} $hasErrorBorder={hasErrorBorder}>
          <Icon icon={type === 'checkbox' ? check : indicator} />
        </CheckboxRadioBox>
      </CheckBoxWrapper>
      <Space as="span" $h={{ size: 's', properties: ['margin-left'] }}>
        {text}
      </Space>
    </CheckboxRadioLabel>
  );
};

export default CheckboxRadio;
