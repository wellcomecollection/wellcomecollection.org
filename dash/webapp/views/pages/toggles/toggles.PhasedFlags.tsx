import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import styled, { css } from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';
import {
  personalPhaseValue,
  phaseLadder,
  PhaseLadderStep,
  PublishedPhasedFlag,
} from '@weco/toggles';

import CopyLinkIcon from './ListOfToggles/ListOfToggles.CopyLinkIcon';
import StatusBadge from './ListOfToggles/ListOfToggles.StatusBadge';
import ToggleDates from './ListOfToggles/ListOfToggles.ToggleDates';
import Group from './toggles.Group';
import { deleteCookieCustom, setCookieCustom } from './toggles.helpers';
import ResetIcon from './toggles.ResetIcon';
import ToggleStarButton from './toggles.StarButton';
import {
  ResetButton,
  ToggleBadge,
  ToggleHeadingRow,
  ToggleInfo,
  ToggleList,
  ToggleListItem,
  ToggleRow,
  ToggleTitle,
} from './toggles.styles';

const MARKER_SIZE = '18px';
const OPTION_PADDING = tokens.spacing.sm;
// Where a marker's circle sits inside its option, for drawing the line between
const MARKER_TOP = '3px';

const PhaseList = styled.fieldset`
  margin: 0;
  padding: 0;
  border: none;
  max-width: 640px;
`;

const PhaseOption = styled.label<{
  $isSelected: boolean;
  $line?: 'active' | 'inactive';
}>`
  position: relative;
  display: grid;
  grid-template-columns: ${MARKER_SIZE} 1fr;
  column-gap: ${tokens.spacing.md};
  padding: ${OPTION_PADDING};
  border-radius: ${tokens.borderRadius.large};
  cursor: pointer;
  background: ${props =>
    props.$isSelected ? tokens.colors.success.light : 'transparent'};

  &:hover {
    background: ${props =>
      props.$isSelected
        ? tokens.colors.success.light
        : tokens.colors.background.paper};
  }

  &:has(input:focus-visible) {
    outline: ${tokens.focus.outline};
    box-shadow: ${tokens.focus.boxShadow};
  }

  input {
    /* Visually hidden but still focusable/operable - the row carries the look */
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  /* Joins this phase's marker to the next one's */
  ${props =>
    props.$line &&
    css`
      &::after {
        content: '';
        position: absolute;

        /* Above the next option's background, which the line reaches into */
        z-index: 1;
        left: calc(${OPTION_PADDING} + (${MARKER_SIZE} / 2) - 1px);
        top: calc(${OPTION_PADDING} + ${MARKER_TOP} + ${MARKER_SIZE});
        bottom: calc(-${OPTION_PADDING} - ${MARKER_TOP});
        width: 2px;
        background: ${
          props.$line === 'active'
            ? tokens.colors.success.main
            : tokens.colors.border.default
        };
      }
    `}
`;

const PhaseMarker = styled.span<{ $state: PhaseLadderStep['state'] }>`
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  width: ${MARKER_SIZE};
  height: ${MARKER_SIZE};
  margin-top: ${MARKER_TOP};
  border-radius: 50%;
  border: 2px solid
    ${props =>
      props.$state === 'inactive'
        ? tokens.colors.border.default
        : tokens.colors.success.main};
  background: ${props => {
    switch (props.$state) {
      case 'current':
        return tokens.colors.success.main;
      case 'included':
        return tokens.colors.success.light;
      default:
        return tokens.colors.background.default;
    }
  }};
`;

const PhaseLabel = styled.span`
  font-weight: 600;
`;

const PhaseDescription = styled.span`
  display: block;
  font-size: ${tokens.typography.fontSize.small};
  color: ${tokens.colors.text.secondary};
`;

const PublicTag = styled.span`
  margin-left: ${tokens.spacing.sm};
  padding: 0 7px;
  border: 1px solid ${tokens.colors.success.main};
  border-radius: 999px;
  color: ${tokens.colors.success.text};
  font-size: ${tokens.typography.fontSize.xsmall};
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  vertical-align: 1px;
`;

type PhasedFlagsProps = {
  phasedFlags: PublishedPhasedFlag[];
  phasedFlagStates: Record<string, string>;
  setPhasedFlagStates: Dispatch<SetStateAction<Record<string, string>>>;
  onReset: () => void;
};

const PhasedFlags: FunctionComponent<PhasedFlagsProps> = ({
  phasedFlags,
  phasedFlagStates,
  setPhasedFlagStates,
  onReset,
}) => (
  <Group
    id="phased-flags"
    title="Phased flags"
    description="Like a feature flag, but with an ordered set of phases instead of on/off - selecting a phase always includes every phase before it."
    isEmpty={phasedFlags.length === 0}
    reset={
      Object.keys(phasedFlagStates).length > 0
        ? {
            label: 'Reset all phases to defaults',
            ariaLabel: 'Reset all phases to defaults for phased flags',
            onClick: onReset,
          }
        : undefined
    }
  >
    <ToggleList role="list">
      {phasedFlags.map(flag => {
        const publicPhase = flag.phases.find(
          phase => phase.id === flag.defaultPhase
        );
        // Distinct from the selected step happening to be the public one -
        // this tracks whether an override cookie actually exists, so an
        // explicit pin to the public phase doesn't look identical to never
        // having overridden it at all.
        const hasOverride = flag.id in phasedFlagStates;
        const steps = phaseLadder(
          flag,
          personalPhaseValue(flag, phasedFlagStates[flag.id])
        );

        const select = (stepId: string) => {
          setCookieCustom(flag.id, stepId);
          setPhasedFlagStates(prev => ({ ...prev, [flag.id]: stepId }));
        };
        const reset = () => {
          deleteCookieCustom(flag.id);
          setPhasedFlagStates(prev => {
            const next = { ...prev };
            delete next[flag.id];
            return next;
          });
        };

        return (
          <ToggleListItem key={flag.id} id={`toggle-${flag.id}`}>
            <ToggleRow>
              <ToggleInfo>
                <ToggleHeadingRow>
                  <ToggleDates
                    dateCreated={flag.dateCreated}
                    dateActivated={flag.dateActivated}
                    activatedLabel="Latest phase public"
                  >
                    <ToggleTitle as="h4" style={{ display: 'inline' }}>
                      <span id={`heading-${flag.id}`}>{flag.title}</span>
                    </ToggleTitle>
                  </ToggleDates>
                  <CopyLinkIcon
                    toggleId={flag.id}
                    title={flag.title}
                    anchor={`toggle-${flag.id}`}
                  />
                  <ToggleStarButton toggleId={flag.id} title={flag.title} />
                  <ToggleBadge>
                    <StatusBadge
                      active={flag.defaultPhase !== null}
                      activeLabel={`Public: ${publicPhase?.label ?? flag.defaultPhase}`}
                      inactiveLabel="Not yet public"
                    />
                  </ToggleBadge>
                  {hasOverride && (
                    <ResetButton
                      type="button"
                      onClick={reset}
                      aria-label={`Reset ${flag.title} to the public view`}
                    >
                      <ResetIcon />
                      Reset
                    </ResetButton>
                  )}
                </ToggleHeadingRow>

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

              <PhaseList aria-labelledby={`heading-${flag.id}`}>
                {steps.map(step => {
                  const isSelected = step.state === 'current';

                  return (
                    <PhaseOption
                      key={step.id}
                      $isSelected={isSelected}
                      $line={step.line}
                    >
                      <PhaseMarker $state={step.state} />
                      <span>
                        <PhaseLabel>{step.label}</PhaseLabel>
                        {step.id === flag.defaultPhase && (
                          <PublicTag>Public</PublicTag>
                        )}
                        {step.description && (
                          <PhaseDescription>
                            {step.description}
                          </PhaseDescription>
                        )}
                      </span>
                      <input
                        type="radio"
                        name={`phase-${flag.id}`}
                        checked={isSelected}
                        onChange={() => select(step.id)}
                        // A change event doesn't fire for the step that's
                        // already selected, so pin the public one on click
                        onClick={() => {
                          if (isSelected && !hasOverride) select(step.id);
                        }}
                      />
                    </PhaseOption>
                  );
                })}
              </PhaseList>
            </ToggleRow>
          </ToggleListItem>
        );
      })}
    </ToggleList>
  </Group>
);

export default PhasedFlags;
