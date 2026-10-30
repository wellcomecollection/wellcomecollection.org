import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import styled, { css } from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';
import { PublishedPhasedFlag } from '@weco/toggles';

import CopyLinkIcon from './ListOfToggles/ListOfToggles.CopyLinkIcon';
import StatusBadge from './ListOfToggles/ListOfToggles.StatusBadge';
import { deleteCookieCustom, setCookieCustom } from './toggles.helpers';
import ToggleStarButton from './toggles.StarButton';
import {
  EmptyGroup,
  ResetButton,
  SectionHeading,
  ToggleBadge,
  ToggleHeadingRow,
  ToggleInfo,
  ToggleList,
  ToggleListItem,
  ToggleRow,
  ToggleTitle,
} from './toggles.styles';

type PhaseState = 'current' | 'included' | 'inactive';

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

const PhaseMarker = styled.span<{ $state: PhaseState }>`
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
};

const PhasedFlags: FunctionComponent<PhasedFlagsProps> = ({
  phasedFlags,
  phasedFlagStates,
  setPhasedFlagStates,
  onReset,
}) =>
  phasedFlags.length === 0 ? (
    <EmptyGroup>
      <SectionHeading as="h3" id="phased-flags" $isSubsection $isCompact>
        Phased flags
        <a href="#phased-flags" aria-label="Link to this section">
          <span aria-hidden="true">#</span>
        </a>
      </SectionHeading>
      <span>None for now, check back later…</span>
    </EmptyGroup>
  ) : (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SectionHeading as="h3" id="phased-flags" $isSubsection>
          Phased flags
          <a href="#phased-flags" aria-label="Link to this section">
            <span aria-hidden="true">#</span>
          </a>
        </SectionHeading>
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
        Like a feature flag, but with an ordered set of phases instead of on/off
        - selecting a phase always includes every phase before it.
      </p>
      {phasedFlags.length > 0 ? (
        <ToggleList role="list">
          {phasedFlags.map(flag => {
            const currentPhase = currentPhaseFor(flag, phasedFlagStates);
            const publicPhase = flag.phases.find(
              phase => phase.id === flag.defaultPhase
            );
            const currentPhaseIndex = flag.phases.findIndex(
              phase => phase.id === currentPhase
            );
            // Distinct from "currentPhase happens to match flag.defaultPhase" -
            // this tracks whether an override cookie actually exists, so an
            // explicit pin to the public phase doesn't look identical to never
            // having overridden it at all.
            const hasOverride = flag.id in phasedFlagStates;

            return (
              <ToggleListItem key={flag.id} id={`toggle-${flag.id}`}>
                <ToggleRow>
                  <ToggleInfo>
                    <ToggleHeadingRow>
                      <ToggleTitle as="h4">
                        <span id={`heading-${flag.id}`}>{flag.title}</span>
                      </ToggleTitle>
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
                    <PhaseOption $isSelected={!hasOverride}>
                      <PhaseMarker
                        $state={hasOverride ? 'inactive' : 'current'}
                      />
                      <span>
                        <PhaseLabel>Default view</PhaseLabel>
                        <PhaseDescription>
                          {publicPhase
                            ? `What everyone sees: ${publicPhase.label}`
                            : 'What everyone sees: nothing yet'}
                        </PhaseDescription>
                      </span>
                      <input
                        type="radio"
                        name={`phase-${flag.id}`}
                        checked={!hasOverride}
                        onChange={() => {
                          deleteCookieCustom(flag.id);
                          setPhasedFlagStates(prev => {
                            const next = { ...prev };
                            delete next[flag.id];
                            return next;
                          });
                        }}
                      />
                    </PhaseOption>

                    {flag.phases.map((phase, index) => {
                      const isSelected =
                        hasOverride && currentPhase === phase.id;
                      // Phases are cumulative - reaching phase 2 means phase 1
                      // shipped too, so every phase up to and including the
                      // current one counts as included, and the line between
                      // markers fills in as far as the next included phase.
                      const state: PhaseState = isSelected
                        ? 'current'
                        : index <= currentPhaseIndex
                          ? 'included'
                          : 'inactive';
                      const isLast = index === flag.phases.length - 1;

                      return (
                        <PhaseOption
                          key={phase.id}
                          $isSelected={isSelected}
                          $line={
                            isLast
                              ? undefined
                              : index + 1 <= currentPhaseIndex
                                ? 'active'
                                : 'inactive'
                          }
                        >
                          <PhaseMarker $state={state} />
                          <span>
                            <PhaseLabel>{phase.label}</PhaseLabel>
                            {phase.description && (
                              <PhaseDescription>
                                {phase.description}
                              </PhaseDescription>
                            )}
                          </span>
                          <input
                            type="radio"
                            name={`phase-${flag.id}`}
                            checked={isSelected}
                            onChange={() => {
                              setCookieCustom(flag.id, phase.id);
                              setPhasedFlagStates(prev => ({
                                ...prev,
                                [flag.id]: phase.id,
                              }));
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
      ) : (
        <p>None for now, check back later…</p>
      )}
    </>
  );

export default PhasedFlags;
