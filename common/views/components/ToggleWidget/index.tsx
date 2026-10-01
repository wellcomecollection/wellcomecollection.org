import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { FunctionComponent, useEffect, useRef, useState } from 'react';

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

import {
  ButtonRow,
  DismissButton,
  Panel,
  PanelHeader,
  ResetLink,
  Segmented,
  SegmentLabel,
  SegmentState,
  SelectToggleOption,
  ToggleBlock,
  ToggleButton,
  ToggleLabel,
  ToggleNote,
  ToggleWidgetWrapper,
} from './ToggleWidget.styles';

const STARRED_TOGGLES_COOKIE = 'starred_toggles';

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
  // Phased flags only: whether a toggle_<id> override cookie actually exists,
  // so a "Reset to public" link can appear - unlike a mode's "Off" or an A/B
  // test's "Randomly allocate me", none of a phased flag's own options can
  // get back to "no override" on their own. Keyed off the cookie's presence
  // rather than "does current differ from public", since an override that
  // happens to match today's public phase still pins the user to it if the
  // public phase later advances - and the widget should let them clear it
  // before that happens, not just once it's visibly out of date.
  hasOverride?: boolean;
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
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  return {
    domain: isLocalhost ? undefined : 'wellcomecollection.org',
    secure: !isLocalhost,
    expires,
  };
}

/**
 * Sets the override cookie for a starred toggle's chosen option - or clears
 * it for the sentinel ids that mean "no override" (a mode's "Off", an A/B
 * test's "Randomly allocate me"). Matches dash's own 1-year expiry
 * (toggles.helpers.ts's standardCookieOptions()) - setting this cookie
 * without one would silently downgrade an existing dash-set override to a
 * session cookie, since a cookie's attributes are replaced wholesale by
 * whoever sets it next, regardless of which surface set it originally.
 */
function applyOverride(id: string, optionId: string) {
  const { domain, secure, expires } = cookieDomainOptions();

  if (optionId === '' || optionId === 'random') {
    deleteCookie(`toggle_${id}`, { domain, path: '/' });
  } else {
    setCookie(`toggle_${id}`, optionId, { domain, path: '/', secure, expires });
  }
  window.location.reload();
}

/**
 * Clears a starred toggle's override entirely, back to whatever's public -
 * for phased flags, which (unlike a mode's "Off" or an A/B test's
 * "Randomly allocate me") have no such option among their own phases.
 */
function resetOverride(id: string) {
  const { domain } = cookieDomainOptions();
  deleteCookie(`toggle_${id}`, { domain, path: '/' });
  window.location.reload();
}

/**
 * Turns the widget off entirely, the same way ApiToolbar's own close
 * button does - sets its gating flag's cookie to false rather than just
 * collapsing the panel, so it stays gone across future page loads too.
 */
function dismissWidget() {
  const { domain, secure, expires } = cookieDomainOptions();
  setCookie('toggle_toggleWidget', 'false', {
    domain,
    path: '/',
    secure,
    expires,
  });
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
            // Matches resolveOptionValue's own validation (common/server-data
            // /toggles.ts) - a cookie whose value isn't one of this flag's
            // current phases (e.g. left over from one that's since graduated
            // or been removed) isn't a live override, so it shouldn't offer
            // a reset link for it either.
            const rawOverride = getCookie(`toggle_${id}`);
            const hasOverride =
              typeof rawOverride === 'string' &&
              phasedFlag.phases.some(phase => phase.id === rawOverride);
            return {
              kind: 'phasedFlag',
              id,
              title: phasedFlag.title,
              current: phasedFlag.current ?? '',
              options: phaseOptions(phasedFlag.phases),
              hasOverride,
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
    <ToggleWidgetWrapper
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
                <SelectToggleOption
                  aria-label={`Value for ${entry.title}`}
                  value={entry.current}
                  onChange={e => applyOverride(entry.id, e.target.value)}
                >
                  {entry.options.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </SelectToggleOption>
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

              {entry.kind === 'phasedFlag' && entry.hasOverride && (
                <ResetLink
                  type="button"
                  onClick={() => resetOverride(entry.id)}
                >
                  Reset to public
                </ResetLink>
              )}
            </ToggleBlock>
          ))}
        </Panel>
      )}
    </ToggleWidgetWrapper>
  );
};

export default ToggleWidget;
