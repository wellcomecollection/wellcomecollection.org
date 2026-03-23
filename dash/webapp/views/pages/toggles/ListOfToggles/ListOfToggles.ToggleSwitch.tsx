import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

const SwitchContainer = styled.div<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  opacity: ${props => (props.$disabled ? 0.5 : 1)};
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};

  &:focus-visible {
    outline: ${tokens.focus.outline};
    box-shadow: ${tokens.focus.boxShadow};
  }
`;

const SwitchTrack = styled.div<{ $checked: boolean; $disabled: boolean }>`
  position: relative;
  width: 44px;
  height: 24px;
  background-color: ${props =>
    props.$checked ? tokens.colors.success.main : tokens.colors.text.disabled};
  border-radius: 12px;
  transition: background-color 200ms ease;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};

  &:hover:not(:disabled) {
    background-color: ${props =>
      props.$checked
        ? tokens.colors.success.text
        : tokens.colors.text.secondary};
  }
`;

const SwitchThumb = styled.div<{ $checked: boolean }>`
  position: absolute;
  top: 2px;
  left: ${props => (props.$checked ? '22px' : '2px')};
  width: 20px;
  height: 20px;
  background-color: ${tokens.colors.white};
  border-radius: 50%;
  transition: left 200ms ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const Label = styled.span<{ $disabled: boolean }>`
  font-size: ${tokens.typography.fontSize.small};
  color: ${props =>
    props.$disabled ? tokens.colors.text.disabled : tokens.colors.text.primary};
  user-select: none;
`;

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
  name: string;
  id: string;
};

const ToggleSwitch: FunctionComponent<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  name,
  id,
}) => {
  const handleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleChange();
    }
  };

  return (
    <SwitchContainer
      $disabled={disabled}
      onClick={handleChange}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={checked}
      aria-label={name}
      tabIndex={disabled ? -1 : 0}
    >
      <HiddenInput
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        id={id}
        tabIndex={-1}
        aria-hidden="true"
      />
      <SwitchTrack $checked={checked} $disabled={disabled}>
        <SwitchThumb $checked={checked} />
      </SwitchTrack>
      {label && <Label $disabled={disabled}>{label}</Label>}
    </SwitchContainer>
  );
};

export default ToggleSwitch;
