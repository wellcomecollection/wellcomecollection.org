import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';
import { PublishedPhasedMode } from '@weco/toggles';

import StatusBadge from './ListOfToggles/ListOfToggles.StatusBadge';
import { deleteCookieCustom, setCookieCustom } from './toggles.helpers';
import {
  ResetButton,
  ToggleControls,
  ToggleInfo,
  ToggleList,
  ToggleListItem,
  ToggleRow,
} from './toggles.styles';

const Segmented = styled.fieldset`
  display: inline-flex;
  border: 1px solid ${tokens.colors.border.default};
  border-radius: ${tokens.borderRadius.large};
  overflow: hidden;
  margin: 0;
  padding: 0;
`;

const SegmentLabel = styled.label<{ $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: ${tokens.spacing.xs} ${tokens.spacing.md};
  font-size: ${tokens.typography.fontSize.small};
  font-weight: 600;
  cursor: pointer;
  background: ${props =>
    props.$checked
      ? tokens.colors.success.main
      : tokens.colors.background.paper};
  color: ${props =>
    props.$checked ? tokens.colors.white : tokens.colors.text.secondary};

  & + & {
    border-left: 1px solid ${tokens.colors.border.default};
  }

  &:has(input:focus-visible) {
    outline: ${tokens.focus.outline};
    box-shadow: ${tokens.focus.boxShadow};
  }

  input {
    /* Visually hidden but still focusable/operable - the label carries the look */
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }
`;

const PhaseDescription = styled.p`
  margin: 0;
  font-size: ${tokens.typography.fontSize.small};
  color: ${tokens.colors.text.secondary};
  text-align: right;
  max-width: 220px;
`;

const ResetLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: ${tokens.typography.fontSize.small};
  color: ${tokens.colors.info.main};
  text-decoration: underline;
  cursor: pointer;

  &:focus-visible {
    outline: ${tokens.focus.outline};
    box-shadow: ${tokens.focus.boxShadow};
  }
`;

// A cookie for a phase that still exists, otherwise the public phase.
const currentPhaseFor = (
  mode: PublishedPhasedMode,
  modeStates: Record<string, string>
): string | null => {
  const override = modeStates[mode.id];
  return mode.options.some(option => option.id === override)
    ? override
    : mode.defaultValue;
};

type PhasedModesProps = {
  phasedModes: PublishedPhasedMode[];
  modeStates: Record<string, string>;
  setModeStates: Dispatch<SetStateAction<Record<string, string>>>;
  onReset: () => void;
};

const PhasedModes: FunctionComponent<PhasedModesProps> = ({
  phasedModes,
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
      <h2 id="phased-modes">
        Phased modes
        <a href="#phased-modes" aria-label="Link to this section">
          <span aria-hidden="true">#</span>
        </a>
      </h2>
      {Object.keys(modeStates).length > 0 && (
        <ResetButton
          onClick={onReset}
          aria-label="Reset all phased modes to their public phase"
        >
          Reset all phases to defaults
        </ResetButton>
      )}
    </div>
    <p style={{ marginTop: 0, color: tokens.colors.text.secondary }}>
      Modes whose options are ordered phases of one feature. Selecting a phase
      always includes every phase before it.
    </p>
    {phasedModes.length > 0 ? (
      <ToggleList role="list">
        {phasedModes.map(flag => {
          const currentPhase = currentPhaseFor(flag, modeStates);
          const publicPhase = flag.options.find(
            phase => phase.id === flag.defaultValue
          );
          const selectedPhase = flag.options.find(
            phase => phase.id === currentPhase
          );
          const isOverridden = currentPhase !== flag.defaultValue;

          return (
            <ToggleListItem key={flag.id} id={`toggle-${flag.id}`}>
              <ToggleRow>
                <ToggleInfo>
                  <h3 id={`heading-${flag.id}`} style={{ margin: 0 }}>
                    {flag.title}
                  </h3>

                  <div style={{ margin: `${tokens.spacing.xs} 0` }}>
                    <StatusBadge
                      active={flag.defaultValue !== null}
                      activeLabel={`Public: ${publicPhase?.label ?? flag.defaultValue}`}
                      inactiveLabel="Not yet public"
                    />
                  </div>

                  <p
                    style={{
                      margin: `${tokens.spacing.xs} 0`,
                      color: tokens.colors.text.secondary,
                    }}
                  >
                    {flag.description}
                  </p>

                  {flag.documentationLink && (
                    <p style={{ margin: `${tokens.spacing.xs} 0` }}>
                      <a
                        href={flag.documentationLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Documentation
                      </a>
                    </p>
                  )}
                </ToggleInfo>

                <ToggleControls>
                  <Segmented aria-labelledby={`heading-${flag.id}`}>
                    {flag.options.map(phase => (
                      <SegmentLabel
                        key={phase.id}
                        $checked={currentPhase === phase.id}
                      >
                        <input
                          type="radio"
                          name={`phase-${flag.id}`}
                          checked={currentPhase === phase.id}
                          onChange={() => {
                            setCookieCustom(flag.id, phase.id);
                            setModeStates(prev => ({
                              ...prev,
                              [flag.id]: phase.id,
                            }));
                          }}
                        />
                        {phase.label}
                      </SegmentLabel>
                    ))}
                  </Segmented>

                  {selectedPhase?.description && (
                    <PhaseDescription>
                      {selectedPhase.description}
                    </PhaseDescription>
                  )}

                  {isOverridden && (
                    <ResetLink
                      type="button"
                      onClick={() => {
                        deleteCookieCustom(flag.id);
                        setModeStates(prev => {
                          const next = { ...prev };
                          delete next[flag.id];
                          return next;
                        });
                      }}
                    >
                      Reset to public
                    </ResetLink>
                  )}
                </ToggleControls>
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

export default PhasedModes;
