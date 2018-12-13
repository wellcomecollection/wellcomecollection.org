// @flow
import styled, {type ReactComponentStyled} from 'styled-components';
import theme from '../../themes/default';
import {font} from '../../../utils/classnames';

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

type StyledInputProps = {||}

const StyledInput: ReactComponentStyled<StyledInputProps> = styled.input`
  width: 100%;
  padding: 0.4em;
  border: 1px solid ${theme.colors.pumice};

  &:focus {
    outline: 0;
    border: 1px solid ${theme.colors.turquoise};
  }

  &::-ms-clear {
    display: none;
  }
`;

type Props = {
  label: string
  // We can also pass inputProps here
}

const TextInput = ({
  label,
  ...inputProps
}: Props) => {
  return (
    <label className='flex flex--v-center'>
      <StyledInput
        className={font({s: 'HNL3', m: 'HNL2'})}
        type='text'
        {...inputProps}/>
      <VisuallyHidden>{label}</VisuallyHidden>
    </label>
  );
};

export default TextInput;
