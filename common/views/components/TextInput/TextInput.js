// @flow
import { forwardRef, type ComponentType } from 'react';
import styled from 'styled-components';
import Space, { type SpaceComponentProps } from '../styled/Space';
import { classNames } from '../../../utils/classnames';

const VisuallyHidden = styled.div`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
`;

const StyledInput: ComponentType<SpaceComponentProps> = styled(Space).attrs({
  className: classNames({}),
})`
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  width: 100%;
  padding-right: 40px;
  border: 2px solid ${props => props.theme.colors.pumice};

  &:focus {
    outline: 0;
    border: 2px solid ${props => props.theme.colors.yellow};
  }

  &::-ms-clear {
    display: none;
  }
`;

type Props = {
  label: string,
  // We can also pass inputProps here
};

// $FlowFixMe (forwardRef)
const TextInput = forwardRef((
  { label, ...inputProps }: Props,
  ref // eslint-disable-line
) => (
  <label className="flex flex--v-center">
    <StyledInput
      v={{
        size: 'm',
        properties: ['padding-top', 'padding-bottom'],
      }}
      h={{ size: 'm', properties: ['padding-left'] }}
      as="input"
      ref={ref}
      type="text"
      {...inputProps}
    />
    <VisuallyHidden>
      <label>{label}</label>
    </VisuallyHidden>
  </label>
));

TextInput.displayName = 'TextInput';

export default TextInput;
