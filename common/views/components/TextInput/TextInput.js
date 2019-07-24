// @flow
import { forwardRef } from 'react';
import styled from 'styled-components';
import VerticalSpace from '../styled/VerticalSpace';
import { classNames, spacing } from '../../../utils/classnames';

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

const StyledInput = styled(VerticalSpace).attrs({
  className: classNames({
    [spacing({ s: 2 }, { padding: ['left'] })]: true,
  }),
})`
  width: 100%;
  padding-right: 40px;
  border: 1px solid ${props => props.theme.colors.pumice};

  &:focus {
    outline: 0;
    border: 1px solid ${props => props.theme.colors.turquoise};
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
      as="input"
      size="m"
      properties={['padding-top', 'padding-bottom']}
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
