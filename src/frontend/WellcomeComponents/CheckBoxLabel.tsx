import { FunctionComponent, SyntheticEvent, ReactElement } from 'react';
import styled from 'styled-components';
import { classNames } from '@weco/common/utils/classnames.js';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';

// NB this component is adapted from CheckboxRadio at '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
// It has been modified to allow HTML to be rendered in the label field, allowing for <a> tags to be rendered.

const CheckboxRadioLabel = styled.label.attrs({
  className: classNames({
    'flex-inline flex--v-center': true,
  }),
})`
  cursor: pointer;
`;

const CheckboxRadioBoxSpan = styled.span<{ type: string }>``;
const CheckboxRadioBox = styled(CheckboxRadioBoxSpan).attrs({
  className: classNames({
    'flex-inline flex--v-center flex--h-center relative': true,
  }),
})`
  width: 1.3em;
  height: 1.3em;
  border: 2px solid ${(props) => props.theme.color('pumice')};
  border-radius: ${(props) => (props.type === 'radio' ? '50%' : '0')};

  .icon {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
  }
`;

const CheckboxRadioInput = styled.input.attrs((props) => ({
  type: props.type === 'checkbox' ? 'checkbox' : 'radio',
}))`
  position: absolute;
  opacity: 0;
  z-index: 1;
  width: 1em;
  height: 1em;

  &:checked ~ ${CheckboxRadioBox} {
    border-color: ${(props) => props.theme.color('black')};

    .icon {
      opacity: 1;
    }
  }

  &:hover ~ ${CheckboxRadioBox} {
    border-color: ${(props) => props.theme.color('black')};
  }

  .is-keyboard & {
    &:focus ~ ${CheckboxRadioBox} {
      outline: 0;
      box-shadow: ${(props) => props.theme.focusBoxShadow};
      border-color: ${(props) => props.theme.color('black')};
    }
  }
`;

type CheckboxRadioProps = {
  type: 'checkbox' | 'radio';
  id: string;
  text: any;
  checked: boolean;
  name: string;
  onChange: (event: SyntheticEvent<HTMLInputElement>) => void;
  value: string;
};

const CheckboxRadio: FunctionComponent<CheckboxRadioProps> = ({
  id,
  text,
  type,
  ...inputProps
}: CheckboxRadioProps): ReactElement<CheckboxRadioProps> => {
  return (
    <CheckboxRadioLabel htmlFor={id}>
      <CheckboxRadioInput id={id} type={type} {...inputProps} />
      <CheckboxRadioBox type={type}>
        <Icon name={type === 'checkbox' ? 'check' : 'indicator'} />
      </CheckboxRadioBox>
      <Space as="span" h={{ size: 'xs', properties: ['margin-left'] }} dangerouslySetInnerHTML={{ __html: text }} />
    </CheckboxRadioLabel>
  );
};

export default CheckboxRadio;
