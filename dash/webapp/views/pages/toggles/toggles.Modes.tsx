import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';
import { ModeDefinition } from '@weco/toggles';

import CopyLinkIcon from './ListOfToggles/ListOfToggles.CopyLinkIcon';
import { deleteCookieCustom, setCookieCustom } from './toggles.helpers';
import ToggleStarButton from './toggles.StarButton';
import {
  ResetButton,
  SectionHeading,
  ToggleControls,
  ToggleHeadingRow,
  ToggleInfo,
  ToggleList,
  ToggleListItem,
  ToggleRow,
  ToggleTitle,
} from './toggles.styles';

const CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%23445254' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

const ModeSelect = styled.select`
  flex: 1;
  min-width: 0;
  appearance: none;
  padding: ${tokens.spacing.sm} 40px ${tokens.spacing.sm} ${tokens.spacing.md};
  font-size: ${tokens.typography.fontSize.base};
  font-family: ${tokens.typography.fontFamily};
  color: ${tokens.colors.text.primary};
  background: ${tokens.colors.background.default} ${CHEVRON} no-repeat right
    ${tokens.spacing.md} center;
  border: 2px solid ${tokens.colors.border.default};
  border-radius: ${tokens.borderRadius.medium};
  cursor: pointer;
  transition: border-color 150ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:hover {
    border-color: ${tokens.colors.primary.dark};
  }

  &:focus-visible {
    outline: 0.3rem double ${tokens.colors.primary.dark};
    box-shadow: 0 0 0 0.3rem ${tokens.colors.background.default};
    border-color: ${tokens.colors.primary.dark};
  }
`;

const MoreInfo = styled.details`
  max-width: 70ch;

  summary {
    cursor: pointer;
    width: fit-content;
    font-size: ${tokens.typography.fontSize.small};
    color: ${tokens.colors.info.main};
  }

  &[open] summary {
    margin-bottom: ${tokens.spacing.xs};
  }
`;

const ModeControlRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${tokens.spacing.xs};
`;

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
}) => (
  <>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <SectionHeading id="modes">
        <a href="#modes">Modes</a>
      </SectionHeading>
      <ResetButton
        onClick={onReset}
        aria-label="Reset all modes to off"
        disabled={Object.keys(modeStates).length === 0}
        style={{
          visibility: Object.keys(modeStates).length > 0 ? 'visible' : 'hidden',
        }}
      >
        Reset all modes
      </ResetButton>
    </div>
    <p style={{ marginTop: 0, color: tokens.colors.text.secondary }}>
      Modes carry structured data beyond a simple on/off, they might represent
      different levels of a feature, or a choice between multiple options.
    </p>
    {modes.length > 0 ? (
      <ToggleList>
        {modes.map(mode => {
          const rawValue = modeStates[mode.id];
          const currentValue = mode.options.some(opt => opt.id === rawValue)
            ? rawValue
            : '';

          const selectedOptionDescription = mode.options.find(
            opt => opt.id === currentValue
          )?.description;

          return (
            <ToggleListItem key={mode.id}>
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
                  </ToggleHeadingRow>
                </ToggleInfo>

                <ToggleControls>
                  <ModeControlRow>
                    <ModeSelect
                      aria-labelledby={`mode-${mode.id}`}
                      value={currentValue}
                      onChange={e => {
                        const value = e.target.value;
                        if (value) {
                          setModeStates(prev => ({
                            ...prev,
                            [mode.id]: value,
                          }));
                          setCookieCustom(mode.id, value);
                        } else {
                          setModeStates(prev => {
                            const next = { ...prev };
                            delete next[mode.id];
                            return next;
                          });
                          deleteCookieCustom(mode.id);
                        }
                      }}
                    >
                      <option value="">
                        Select a {mode.title.toLowerCase()}
                      </option>
                      {mode.options.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </ModeSelect>
                    <span
                      style={{
                        visibility: currentValue ? 'visible' : 'hidden',
                      }}
                    >
                      <CopyLinkIcon
                        toggleId={mode.id}
                        title={mode.title}
                        modeValue={currentValue}
                      />
                    </span>
                  </ModeControlRow>
                </ToggleControls>

                {selectedOptionDescription && (
                  <p
                    style={{
                      margin: 0,
                      maxWidth: '70ch',
                      color: tokens.colors.text.secondary,
                    }}
                  >
                    {selectedOptionDescription}
                  </p>
                )}

                <MoreInfo>
                  <summary>About this {mode.title.toLowerCase()}</summary>
                  {mode.description.split('\n\n').map((paragraph, i) => (
                    <p
                      key={i}
                      style={{
                        margin: `${tokens.spacing.xs} 0`,
                        color: tokens.colors.text.secondary,
                      }}
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                    />
                  ))}
                </MoreInfo>
              </ToggleRow>
            </ToggleListItem>
          );
        })}
      </ToggleList>
    ) : (
      <p>None for now, check back later…</p>
    )}
  </>
);

export default Modes;
