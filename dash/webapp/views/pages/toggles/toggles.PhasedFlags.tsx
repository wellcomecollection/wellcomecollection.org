import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';
import { PublishedPhasedFlag } from '@weco/toggles';

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
import ToggleStarButton from './ToggleStarButton';

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

/**
 * Resolves what's currently selected for a phased flag: an override cookie
 * if it's still a valid phase, otherwise whatever's public (defaultPhase,
 * which is null when nothing's public yet).
 */
const currentPhaseFor = (
  flag: PublishedPhasedFlag,
  phasedFlagStates: Record<string, string>
): string | null => {
  const override = phasedFlagStates[flag.id];
  const isValidOverride =
    override !== undefined && flag.phases.some(phase => phase.id === override);
  return isValidOverride ? override : flag.defaultPhase;
};

type PhasedFlagsProps = {
  phasedFlags: PublishedPhasedFlag[];
  phasedFlagStates: Record<string, string>;
  setPhasedFlagStates: Dispatch<SetStateAction<Record<string, string>>>;
  onReset: () => void;
  starredIds: string[];
  onToggleStar: (id: string) => void;
};

const PhasedFlags: FunctionComponent<PhasedFlagsProps> = ({
  phasedFlags,
  phasedFlagStates,
  setPhasedFlagStates,
  onReset,
  starredIds,
  onToggleStar,
}) => (
  <>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h2 id="phased-flags">
        Phased flags
        <a href="#phased-flags" aria-label="Link to this section">
          <span aria-hidden="true">#</span>
        </a>
      </h2>
      {Object.keys(phasedFlagStates).length > 0 && (
        <ResetButton
          onClick={onReset}
          aria-label="Reset all phased flags to their public phase"
        >
          Reset all phases to defaults
        </ResetButton>
      )}
    </div>
    <p style={{ marginTop: 0, color: tokens.colors.text.secondary }}>
      Like a feature flag, but with an ordered set of phases instead of on/off -
      selecting a phase always includes every phase before it.
    </p>
    {phasedFlags.length > 0 ? (
      <ToggleList role="list">
        {phasedFlags.map(flag => {
          const currentPhase = currentPhaseFor(flag, phasedFlagStates);
          const publicPhase = flag.phases.find(
            phase => phase.id === flag.defaultPhase
          );
          const selectedPhase = flag.phases.find(
            phase => phase.id === currentPhase
          );
          const isOverridden = currentPhase !== flag.defaultPhase;

          return (
            <ToggleListItem key={flag.id} id={`toggle-${flag.id}`}>
              <ToggleRow>
                <ToggleInfo>
                  <h3 id={`heading-${flag.id}`} style={{ margin: 0 }}>
                    {flag.title}
                    <ToggleStarButton
                      toggleId={flag.id}
                      title={flag.title}
                      starredIds={starredIds}
                      onToggle={onToggleStar}
                    />
                  </h3>

                  <div style={{ margin: `${tokens.spacing.xs} 0` }}>
                    <StatusBadge
                      active={flag.defaultPhase !== null}
                      activeLabel={`Public: ${publicPhase?.label ?? flag.defaultPhase}`}
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
                    {flag.phases.map(phase => (
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
                            setPhasedFlagStates(prev => ({
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
                        setPhasedFlagStates(prev => {
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

export default PhasedFlags;
