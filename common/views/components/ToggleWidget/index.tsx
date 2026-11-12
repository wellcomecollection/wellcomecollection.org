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
  featureFlagCookieValue,
  ModeOption,
  personalPhaseValue,
  PhaseDefinition,
  ResolvedPhasedFlag,
  TOGGLE_OFF_VALUE,
  TogglesResp,
} from '@weco/toggles';

import {
  ButtonRow,
  DismissButton,
  Ladder,
  LadderMarker,
  LadderRung,
  Panel,
  PanelHeader,
  PublicTag,
  ResetButton,
  Segmented,
  SegmentLabel,
  SegmentState,
  SelectToggleOption,
  ToggleBlock,
  ToggleButton,
  ToggleHeading,
  ToggleLabel,
  ToggleNote,
  ToggleWidgetWrapper,
} from './ToggleWidget.styles';

const STARRED_TOGGLES_COOKIE = 'starred_toggles';
const DASH_URL = 'https://dash.wellcomecollection.org/toggles';

type Option = { id: string; label: string };

type EntryKind = 'featureFlag' | 'mode' | 'abTest' | 'phasedFlag';

type StarredEntry = {
  kind: EntryKind;
  id: string;
  title: string;
  current: string;
  options: Option[];
  /** Feature flags: defaultValue is true, so On is what everyone sees. */
  isPublic?: boolean;
  /** Feature flags: the switch is disabled, as a public non-experimental flag can't be turned off for yourself. */
  locked?: boolean;
  /**
   * Phased flags: whether a toggle_<id> cookie exists, so Reset shows. True
   * even if the cookie matches the public phase, as it would still pin the
   * user if the public phase moved on.
   */
  hasOverride?: boolean;
  /** Phased flags: the id of the public phase, or null if none is public yet. */
  publicId?: string | null;
};

const AB_TEST_OPTIONS: Option[] = [
  { id: 'true', label: 'Count me in' },
  { id: 'false', label: 'No thanks' },
  { id: 'random', label: 'Randomly allocate me' },
];

// The option that matches what everyone sees has the empty id, which clears the
// cookie (see applyOverride), so going back to the public value keeps no cookie
const featureFlagOptions = (flag: {
  type: string;
  defaultValue: boolean;
}): Option[] => [
  { id: featureFlagCookieValue(flag, false) ?? '', label: 'Off' },
  { id: featureFlagCookieValue(flag, true) ?? '', label: 'On' },
];

const modeOptions = (options: readonly ModeOption[]): Option[] => [
  { id: '', label: 'Off' },
  ...options.map(option => ({ id: option.id, label: option.label })),
];

const phaseOptions = (phases: readonly PhaseDefinition[]): Option[] =>
  phases.map(phase => ({ id: phase.id, label: phase.label }));

// Matches the anchor ids dash puts on each toggle's list item - modes use
// their own prefix, everything else shares toggle-.
const dashAnchorUrl = ({ kind, id }: StarredEntry): string =>
  `${DASH_URL}#${kind === 'mode' ? 'mode' : 'toggle'}-${id}`;

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

/** Clears a starred toggle's override entirely, back to whatever's public. */
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
            // Same validation as the server (personalPhaseValue): a cookie that
            // isn't one of this flag's current phases (e.g. left over from one
            // that's since graduated or been removed), or `off` before
            // anything is public, isn't a live override, so there's nothing
            // to reset.
            const rawOverride = getCookie(`toggle_${id}`);
            const publicPhaseId =
              togglesJson.phasedFlags?.find(f => f.id === id)?.defaultPhase ??
              null;
            const personalValue =
              typeof rawOverride === 'string'
                ? personalPhaseValue(
                    {
                      phases: phasedFlag.phases,
                      defaultPhase: publicPhaseId,
                    },
                    rawOverride
                  )
                : undefined;
            const isOff = personalValue === null;

            return {
              kind: 'phasedFlag',
              id,
              title: phasedFlag.title,
              current: isOff ? TOGGLE_OFF_VALUE : (phasedFlag.current ?? ''),
              // Off comes first once a phase is public, as the step before them all
              options: [
                ...(publicPhaseId !== null
                  ? [{ id: TOGGLE_OFF_VALUE, label: 'Off' }]
                  : []),
                ...phaseOptions(phasedFlag.phases),
              ],
              hasOverride: personalValue !== undefined,
              publicId: publicPhaseId,
            };
          }

          const featureFlag = togglesJson.featureFlags.find(f => f.id === id);
          if (featureFlag) {
            const current = (
              featureFlags as Record<string, boolean | undefined>
            )[id];
            const isExperimental = featureFlag.type === 'experimental';
            const isOn = current ?? featureFlag.defaultValue;

            return {
              kind: 'featureFlag',
              id,
              title: featureFlag.title,
              current: featureFlagCookieValue(featureFlag, isOn) ?? '',
              options: featureFlagOptions(featureFlag),
              isPublic: featureFlag.defaultValue === true,
              locked: featureFlag.defaultValue === true && !isExperimental,
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
          aria-label="toggle states"
        >
          <PanelHeader>
            Starred toggles (
            <a href={DASH_URL} target="_blank" rel="noopener noreferrer">
              view dashboard
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
            )
          </PanelHeader>
          {entries.map(entry => (
            <ToggleBlock key={entry.id}>
              <ToggleHeading>
                <ToggleLabel>
                  <a
                    href={dashAnchorUrl(entry)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {entry.title}
                    <span className="visually-hidden">
                      {' '}
                      (opens in a new tab)
                    </span>
                  </a>
                  {entry.isPublic && <ToggleNote>(Public)</ToggleNote>}
                </ToggleLabel>
                {entry.kind === 'phasedFlag' && entry.hasOverride && (
                  <ResetButton
                    type="button"
                    onClick={() => resetOverride(entry.id)}
                    aria-label={`Reset ${entry.title} to the public view`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 12a9 9 0 1 0 3-6.7" />
                      <path d="M3 4v5h5" />
                    </svg>
                    Reset
                  </ResetButton>
                )}
              </ToggleHeading>

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
              ) : entry.kind === 'phasedFlag' ? (
                <Ladder aria-label={`Value for ${entry.title}`}>
                  {entry.options.map((option, index) => {
                    const currentIndex = entry.options.findIndex(
                      o => o.id === entry.current
                    );
                    const isSelected = index === currentIndex;
                    // Steps are cumulative - reaching phase 2 means phase 1
                    // shipped too, so every step before the selected one
                    // counts as included.
                    const state: SegmentState = isSelected
                      ? 'current'
                      : index < currentIndex
                        ? 'included'
                        : 'inactive';
                    const isLast = index === entry.options.length - 1;

                    return (
                      <LadderRung
                        key={option.id}
                        $state={state}
                        $line={
                          isLast
                            ? undefined
                            : index + 1 <= currentIndex
                              ? 'active'
                              : 'inactive'
                        }
                      >
                        <input
                          type="radio"
                          name={`toggle-widget-${entry.id}`}
                          checked={isSelected}
                          onChange={() => applyOverride(entry.id, option.id)}
                          // A change event doesn't fire for the step that's
                          // already selected, so pin the public one on click
                          onClick={() => {
                            if (isSelected && !entry.hasOverride) {
                              applyOverride(entry.id, option.id);
                            }
                          }}
                        />
                        <LadderMarker $state={state} aria-hidden="true" />
                        <span>{option.label}</span>
                        {option.id === entry.publicId && (
                          <PublicTag>Public</PublicTag>
                        )}
                      </LadderRung>
                    );
                  })}
                </Ladder>
              ) : (
                <Segmented
                  aria-label={`Value for ${entry.title}`}
                  disabled={entry.locked}
                >
                  {entry.options.map(option => {
                    const isSelected = entry.current === option.id;

                    return (
                      <SegmentLabel
                        key={option.id}
                        $state={isSelected ? 'current' : 'inactive'}
                      >
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
    </ToggleWidgetWrapper>
  );
};

export default ToggleWidget;
