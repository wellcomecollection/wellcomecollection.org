import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { cross, filter } from '@weco/common/icons';
import {
  useABTest,
  useFeatureFlags,
  useModes,
  usePhasedFlags,
} from '@weco/common/server-data/Context';
import Icon from '@weco/common/views/components/Icon';
import {
  ModeOption,
  PhaseDefinition,
  ResolvedPhasedFlag,
  TogglesResp,
} from '@weco/toggles';

// Lets anyone switch which state they're seeing for any toggle a dashboard
// user has starred (feature flag, mode, A/B test or phased flag), without
// going through the toggles dashboard. Modelled on ApiToolbar and on
// Vercel's Toolbar Flags Explorer: sleeping/collapsed by default so it
// never adds noise to the tab order or screen-reader flow until
// deliberately opened.

const STARRED_TOGGLES_COOKIE = 'starred_toggles';

const Wrapper = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 100;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border: none;
  border-radius: 999px;
  background-color: ${props => props.theme.color('accent.purple')};
  color: ${props => props.theme.color('white')};
  cursor: pointer;
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(0.9);
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.color('accent.purple')};
    outline-offset: 4px;
  }
`;

const DismissButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: ${props => props.theme.color('accent.purple')};
  color: ${props => props.theme.color('white')};
  cursor: pointer;
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(0.9);
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.color('accent.purple')};
    outline-offset: 2px;
  }
`;

const Panel = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  width: 320px;
  max-height: 60vh;
  overflow-y: auto;
  background-color: ${props => props.theme.color('white')};
  color: ${props => props.theme.color('neutral.700')};
  border: 1px solid ${props => props.theme.color('neutral.400')};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  padding: 16px;

  &:focus-visible {
    outline: 2px solid ${props => props.theme.color('accent.purple')};
  }
`;

const PanelHeader = styled.p`
  margin: 0 0 12px;
  padding-bottom: 12px;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid ${props => props.theme.color('neutral.300')};
`;

const ToggleBlock = styled.div`
  & + & {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid ${props => props.theme.color('neutral.300')};
  }
`;

const ToggleLabel = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
`;

const ToggleNote = styled.span`
  margin-left: 6px;
  font-weight: 400;
  font-size: 12px;
  color: ${props => props.theme.color('neutral.600')};
`;

const Segmented = styled.fieldset`
  display: inline-flex;
  border: 1px solid ${props => props.theme.color('neutral.400')};
  border-radius: 999px;
  overflow: hidden;
  margin: 8px 0 0;
  padding: 0;

  &:disabled {
    opacity: 0.5;
  }
`;

type SegmentState = 'current' | 'included' | 'inactive';

const SegmentLabel = styled.label<{ $state: SegmentState }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: 13px;
  cursor: pointer;
  background-color: ${props =>
    props.$state === 'current'
      ? props.theme.color('accent.green')
      : props.$state === 'included'
        ? props.theme.color('accent.lightGreen')
        : 'transparent'};
  color: ${props =>
    props.$state === 'current'
      ? props.theme.color('white')
      : props.theme.color('neutral.700')};

  & + & {
    border-left: 1px solid ${props => props.theme.color('neutral.400')};
  }

  /* Segmented's overflow: hidden clips anything outside the pill shape, so
     the focus ring has to sit inside the label's own box (negative offset)
     rather than around it. */
  &:has(input:focus-visible) {
    position: relative;
    z-index: 1;
    outline: 3px solid ${props => props.theme.color('accent.purple')};
    outline-offset: -3px;
  }

  input {
    /* Visually hidden but still focusable/operable - the label carries the look */
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }
`;

const Select = styled.select`
  display: block;
  margin-top: 8px;
  max-width: 100%;
  padding: 4px 8px;
  font-size: 13px;
  border: 1px solid ${props => props.theme.color('neutral.400')};
  border-radius: 4px;

  &:focus-visible {
    outline: 2px solid ${props => props.theme.color('accent.purple')};
    outline-offset: 2px;
  }
`;

type Option = { id: string; label: string };

type EntryKind = 'featureFlag' | 'mode' | 'abTest' | 'phasedFlag';

type StarredEntry = {
  kind: EntryKind;
  id: string;
  title: string;
  current: string;
  options: Option[];
  // Feature flags only: true once a flag's defaultValue is true (Public) -
  // the cookie resolver only ever checks for 'true', so a 'false' override
  // can never turn a Public flag off, same as the dashboard's own
  // disabled-switch-when-Public behaviour.
  locked?: boolean;
};

const AB_TEST_OPTIONS: Option[] = [
  { id: 'true', label: 'Count me in' },
  { id: 'false', label: 'No thanks' },
  { id: 'random', label: 'Randomly allocate me' },
];

const FEATURE_FLAG_OPTIONS: Option[] = [
  { id: 'true', label: 'On' },
  { id: 'false', label: 'Off' },
];

const modeOptions = (options: readonly ModeOption[]): Option[] => [
  { id: '', label: 'Off' },
  ...options.map(option => ({ id: option.id, label: option.label })),
];

const phaseOptions = (phases: readonly PhaseDefinition[]): Option[] =>
  phases.map(phase => ({ id: phase.id, label: phase.label }));

function cookieDomainOptions() {
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';
  return {
    domain: isLocalhost ? undefined : 'wellcomecollection.org',
    secure: !isLocalhost,
  };
}

/**
 * Sets the override cookie for a starred toggle's chosen option - or clears
 * it for the sentinel ids that mean "no override" (a mode's "Off", an A/B
 * test's "Randomly allocate me").
 */
function applyOverride(id: string, optionId: string) {
  const { domain, secure } = cookieDomainOptions();

  if (optionId === '' || optionId === 'random') {
    deleteCookie(`toggle_${id}`, { domain, path: '/' });
  } else {
    setCookie(`toggle_${id}`, optionId, { domain, path: '/', secure });
  }
  window.location.reload();
}

/**
 * Turns the widget off entirely, the same way ApiToolbar's own close
 * button does - sets its gating flag's cookie to false rather than just
 * collapsing the panel, so it stays gone across future page loads too.
 */
function dismissWidget() {
  const { domain, secure } = cookieDomainOptions();
  setCookie('toggle_toggleWidget', 'false', { domain, path: '/', secure });
}

const ToggleWidget: FunctionComponent = () => {
  const featureFlags = useFeatureFlags();
  const modes = useModes();
  const abTests = useABTest();
  const phasedFlags = usePhasedFlags();

  const [togglesJson, setTogglesJson] = useState<TogglesResp | undefined>(
    undefined
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetch('https://toggles.wellcomecollection.org/toggles.json')
      .then(resp => resp.json())
      .then(setTogglesJson)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  const starredIds = (getCookie(STARRED_TOGGLES_COOKIE) ?? '')
    .toString()
    .split(',')
    .filter(Boolean);

  const entries: StarredEntry[] = togglesJson
    ? starredIds
        .map((id): StarredEntry | undefined => {
          const phasedFlag = (
            phasedFlags as Record<string, ResolvedPhasedFlag>
          )[id];
          if (phasedFlag) {
            return {
              kind: 'phasedFlag',
              id,
              title: phasedFlag.title,
              current: phasedFlag.current ?? '',
              options: phaseOptions(phasedFlag.phases),
            };
          }

          const featureFlag = togglesJson.featureFlags.find(f => f.id === id);
          if (featureFlag) {
            const current = (
              featureFlags as Record<string, boolean | undefined>
            )[id];
            return {
              kind: 'featureFlag',
              id,
              title: featureFlag.title,
              current: (current ?? featureFlag.defaultValue) ? 'true' : 'false',
              options: FEATURE_FLAG_OPTIONS,
              locked: featureFlag.defaultValue === true,
            };
          }

          const mode = togglesJson.modes.find(m => m.id === id);
          if (mode) {
            const current = (modes as Record<string, string | null>)[id];
            return {
              kind: 'mode',
              id,
              title: mode.title,
              current: current ?? '',
              options: modeOptions(mode.options),
            };
          }

          const abTest = togglesJson.tests.find(t => t.id === id);
          if (abTest) {
            const current = (abTests as Record<string, boolean | undefined>)[
              id
            ];
            return {
              kind: 'abTest',
              id,
              title: abTest.title,
              current:
                current === true
                  ? 'true'
                  : current === false
                    ? 'false'
                    : 'random',
              options: AB_TEST_OPTIONS,
            };
          }

          // Starred but no longer exists (removed since it was starred).
          return undefined;
        })
        .filter((entry): entry is StarredEntry => entry !== undefined)
    : [];

  if (entries.length === 0 || isDismissed) return null;

  return (
    <Wrapper
      data-component="toggle-widget"
      onKeyDown={e => {
        if (e.key === 'Escape' && isOpen) {
          setIsOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <ButtonRow>
        <ToggleButton
          ref={buttonRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls="toggle-widget-panel"
          onClick={() => setIsOpen(v => !v)}
        >
          <Icon icon={filter} iconColor="white" />
          Toggles
        </ToggleButton>
        <DismissButton
          type="button"
          onClick={() => {
            dismissWidget();
            setIsDismissed(true);
          }}
        >
          <span className="visually-hidden">Remove this widget</span>
          <Icon iconColor="white" icon={cross} />
        </DismissButton>
      </ButtonRow>

      {isOpen && (
        <Panel
          id="toggle-widget-panel"
          ref={panelRef}
          tabIndex={-1}
          role="region"
          aria-label="Preview toggle states"
        >
          <PanelHeader>Preview toggles</PanelHeader>
          {entries.map(entry => (
            <ToggleBlock key={entry.id}>
              <ToggleLabel>
                {entry.title}
                {entry.locked && <ToggleNote>(Public)</ToggleNote>}
              </ToggleLabel>
              {entry.kind === 'mode' ? (
                <Select
                  aria-label={`Value for ${entry.title}`}
                  value={entry.current}
                  onChange={e => applyOverride(entry.id, e.target.value)}
                >
                  {entry.options.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <Segmented
                  aria-label={`Value for ${entry.title}`}
                  disabled={entry.locked}
                >
                  {entry.options.map((option, index) => {
                    const isSelected = entry.current === option.id;
                    // Phases are cumulative - reaching phase 2 means phase 1
                    // shipped too, so show every phase up to and including
                    // the current one as active, not just the exact match.
                    // Earlier phases get a paler shade than the current one
                    // so it's clear which phase we're actually on.
                    const currentIndex = entry.options.findIndex(
                      o => o.id === entry.current
                    );
                    const state: SegmentState = isSelected
                      ? 'current'
                      : entry.kind === 'phasedFlag' && index < currentIndex
                        ? 'included'
                        : 'inactive';

                    return (
                      <SegmentLabel key={option.id} $state={state}>
                        <input
                          type="radio"
                          name={`toggle-widget-${entry.id}`}
                          checked={isSelected}
                          onChange={() => applyOverride(entry.id, option.id)}
                        />
                        {option.label}
                      </SegmentLabel>
                    );
                  })}
                </Segmented>
              )}
            </ToggleBlock>
          ))}
        </Panel>
      )}
    </Wrapper>
  );
};

export default ToggleWidget;
