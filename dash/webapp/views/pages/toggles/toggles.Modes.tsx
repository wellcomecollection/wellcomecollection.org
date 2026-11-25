import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';
import { ModeDefinition } from '@weco/toggles';

import CopyLinkIcon from './ListOfToggles/ListOfToggles.CopyLinkIcon';
import StatusBadge from './ListOfToggles/ListOfToggles.StatusBadge';
import Group from './toggles.Group';
import { deleteCookieCustom, setCookieCustom } from './toggles.helpers';
import ToggleStarButton from './toggles.StarButton';
import {
  ToggleBadge,
  ToggleHeadingRow,
  ToggleInfo,
  ToggleList,
  ToggleListItem,
  ToggleRow,
  ToggleTitle,
} from './toggles.styles';

const Chevron = styled.span`
  margin-left: auto;
  width: 8px;
  height: 8px;
  border-right: 2px solid ${tokens.colors.text.secondary};
  border-bottom: 2px solid ${tokens.colors.text.secondary};
  transform: translateY(-2px) rotate(45deg);
  transition: transform 150ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const OptionsCard = styled.details`
  background: ${tokens.colors.background.section};
  border: 1px solid ${tokens.colors.border.default};
  border-radius: ${tokens.borderRadius.medium};
  overflow: hidden;

  &[open] > summary {
    border-bottom: 1px solid ${tokens.colors.border.default};
  }

  &[open] ${Chevron} {
    transform: translateY(2px) rotate(-135deg);
  }
`;

const OptionsSummary = styled.summary`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  padding: 9px ${tokens.spacing.md};
  background: ${tokens.colors.background.sectionDark};
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.fontSize.xsmall};
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    filter: brightness(0.97);
  }

  &:focus-visible {
    outline: 3px solid ${tokens.colors.primary.dark};
    outline-offset: -3px;
  }
`;

const OptionCount = styled.span`
  min-width: 20px;
  padding: 1px 6px;
  border: 1px solid ${tokens.colors.border.default};
  border-radius: 999px;
  background: ${tokens.colors.background.section};
  font-size: 0.6875rem;
  letter-spacing: 0;
  text-align: center;
`;

const OptionsList = styled.fieldset`
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
`;

const HiddenLegend = styled.legend`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

/** What an option row looks like: the mode's active option, "Off" when nothing's on, or neither. */
type OptionState = 'active' | 'off' | 'idle';

const OptionMarker = styled.span<{ $state: OptionState }>`
  position: relative;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  border: 2px solid
    ${props => {
      if (props.$state === 'active') return tokens.colors.white;
      return props.$state === 'off'
        ? tokens.colors.text.secondary
        : tokens.colors.text.disabled;
    }};
  border-radius: ${tokens.borderRadius.full};
  background: ${tokens.colors.white};

  ${props =>
    props.$state !== 'idle' &&
    `
      &::after {
        content: '';
        position: absolute;
        inset: 3px;
        border-radius: 50%;
        background: ${
          props.$state === 'active'
            ? tokens.colors.success.main
            : tokens.colors.text.secondary
        };
      }
    `}
`;

const OptionDescription = styled.span<{ $state: OptionState }>`
  color: ${props =>
    props.$state === 'active'
      ? tokens.colors.success.light
      : tokens.colors.text.secondary};

  @media (max-width: 560px) {
    grid-column: 2;

    &:empty {
      display: none;
    }
  }
`;

/**
 * A row is a label and the copy link button side by side, not one label around
 * both: a button inside a label would be folded into the radio's name.
 */
const OptionRow = styled.div<{ $state: OptionState }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  border-top: 1px solid ${tokens.colors.border.default};
  background: ${props => {
    if (props.$state === 'active') return tokens.colors.success.main;
    return props.$state === 'off'
      ? tokens.colors.background.sectionDark
      : 'transparent';
  }};
  color: ${props =>
    props.$state === 'active'
      ? tokens.colors.white
      : tokens.colors.text.primary};
  font-size: ${tokens.typography.fontSize.xsmall};

  &:first-of-type {
    border-top: 0;
  }

  &:hover {
    background: ${props => {
      if (props.$state === 'active') return tokens.colors.success.main;
      return props.$state === 'off'
        ? tokens.colors.background.sectionDark
        : tokens.colors.background.paper;
    }};
  }

  &:has(input:focus-visible) {
    outline: 3px solid
      ${props =>
        props.$state === 'active'
          ? tokens.colors.white
          : tokens.colors.primary.dark};
    outline-offset: -3px;
  }

  input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  button {
    color: ${props =>
      props.$state === 'active' ? tokens.colors.white : 'inherit'};
  }

  button:hover {
    background: ${props =>
      props.$state === 'active'
        ? 'rgba(255, 255, 255, 0.18)'
        : tokens.colors.info.light};
    color: ${props =>
      props.$state === 'active'
        ? tokens.colors.white
        : tokens.colors.info.text};
  }
`;

const OptionLabel = styled.label`
  display: grid;
  grid-template-columns: 18px minmax(0, 250px) minmax(0, 1fr);
  column-gap: 12px;
  align-items: start;
  padding: 10px 0 10px ${tokens.spacing.md};
  cursor: pointer;

  @media (max-width: 560px) {
    grid-template-columns: 18px minmax(0, 1fr);
  }
`;

const OptionLink = styled.span`
  padding: 10px ${tokens.spacing.md} 10px ${tokens.spacing.sm};
`;

type ModeItemProps = {
  mode: ModeDefinition;
  /** The selected option's id, or an empty string when the mode is off */
  currentValue: string;
  onSelect: (value: string) => void;
};

const ModeItem: FunctionComponent<ModeItemProps> = ({
  mode,
  currentValue,
  onSelect,
}) => {
  // Open to start with when the mode's on, then left however it's set
  const [isOpen, setIsOpen] = useState(currentValue !== '');
  const activeLabel = mode.options.find(opt => opt.id === currentValue)?.label;

  const options = [
    { id: '', label: 'Off', description: undefined },
    ...mode.options,
  ];

  return (
    <ToggleListItem>
      <ToggleRow>
        <ToggleInfo>
          <ToggleHeadingRow>
            <ToggleTitle>
              <span id={`mode-${mode.id}`}>{mode.title}</span>
            </ToggleTitle>
            <CopyLinkIcon
              toggleId={mode.id}
              title={mode.title}
              anchor={`mode-${mode.id}`}
            />
            <ToggleStarButton toggleId={mode.id} title={mode.title} />
            <ToggleBadge>
              <StatusBadge
                active={currentValue !== ''}
                activeLabel={`Active in this browser: ${activeLabel}`}
                inactiveLabel="Off"
              />
            </ToggleBadge>
          </ToggleHeadingRow>
          {mode.description.split('\n\n').map((paragraph, i) => (
            <p
              key={i}
              style={{
                margin: `${tokens.spacing.xs} 0`,
                color: tokens.colors.text.secondary,
                fontSize: tokens.typography.fontSize.small,
              }}
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}
        </ToggleInfo>

        <OptionsCard
          open={isOpen}
          onToggle={e => setIsOpen(e.currentTarget.open)}
        >
          <OptionsSummary>
            <span>Options</span>
            <OptionCount>{mode.options.length}</OptionCount>
            <Chevron aria-hidden="true" />
          </OptionsSummary>
          <OptionsList>
            <HiddenLegend>{mode.title}</HiddenLegend>
            {options.map(opt => {
              const isSelected = opt.id === currentValue;
              let state: OptionState = 'idle';
              if (isSelected) state = opt.id === '' ? 'off' : 'active';

              return (
                <OptionRow key={opt.id} $state={state}>
                  <OptionLabel>
                    <input
                      type="radio"
                      name={`mode-${mode.id}-options`}
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => onSelect(opt.id)}
                    />
                    <OptionMarker $state={state} aria-hidden="true" />
                    <span>{opt.label}</span>
                    <OptionDescription $state={state}>
                      {opt.description}
                    </OptionDescription>
                  </OptionLabel>
                  <OptionLink>
                    <CopyLinkIcon
                      toggleId={mode.id}
                      title={
                        opt.id ? `${mode.title}: ${opt.label}` : mode.title
                      }
                      modeValue={opt.id}
                    />
                  </OptionLink>
                </OptionRow>
              );
            })}
          </OptionsList>
        </OptionsCard>
      </ToggleRow>
    </ToggleListItem>
  );
};

type ModesProps = {
  modes: ModeDefinition[];
  modeStates: Record<string, string>;
  setModeStates: Dispatch<SetStateAction<Record<string, string>>>;
  onReset: () => void;
};

const Modes: FunctionComponent<ModesProps> = ({
  modes,
  modeStates,
  setModeStates,
  onReset,
}) => {
  const selectOption = (modeId: string, value: string) => {
    if (value) {
      setModeStates(prev => ({ ...prev, [modeId]: value }));
      setCookieCustom(modeId, value);
    } else {
      setModeStates(prev => {
        const next = { ...prev };
        delete next[modeId];
        return next;
      });
      deleteCookieCustom(modeId);
    }
  };

  return (
    <Group
      id="modes"
      title="Modes"
      description="Modes carry structured data beyond a simple on/off, they might represent different levels of a feature, or a choice between multiple options."
      isEmpty={modes.length === 0}
      reset={
        Object.keys(modeStates).length > 0
          ? {
              label: 'Reset all modes',
              ariaLabel: 'Reset all modes to defaults',
              onClick: onReset,
            }
          : undefined
      }
      isSection
    >
      <ToggleList>
        {modes.map(mode => {
          const rawValue = modeStates[mode.id];
          const currentValue = mode.options.some(opt => opt.id === rawValue)
            ? rawValue
            : '';

          return (
            <ModeItem
              key={mode.id}
              mode={mode}
              currentValue={currentValue}
              onSelect={value => selectOption(mode.id, value)}
            />
          );
        })}
      </ToggleList>
    </Group>
  );
};

export default Modes;
