// @flow
import styled from 'styled-components';
import { font } from '../../../utils/classnames';

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

const StyledInput = styled.input`
  width: 100%;
  padding: 0.4em;
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
const TextInput = React.forwardRef(({ label, ...inputProps }: Props, ref) => ( // eslint-disable-line
  <label className="flex flex--v-center">
    <StyledInput
      ref={ref}
      className={font({ s: 'HNL3', m: 'HNL2' })}
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
