import { getCookie } from 'cookies-next';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';
import { TOGGLE_OFF_VALUE } from '@weco/toggles';

import Group from '../toggles.Group';
import {
  deleteCookieCustom,
  FeatureFlag,
  setFeatureFlagCookie,
  ToggleStates,
} from '../toggles.helpers';
import ToggleStarButton from '../toggles.StarButton';
import {
  ToggleBadge,
  ToggleControls,
  ToggleHeadingRow,
  ToggleInfo,
  ToggleList,
  ToggleListItem,
  ToggleRow,
  ToggleTitle,
} from '../toggles.styles';
import CopyLinkIcon from './ListOfToggles.CopyLinkIcon';
import StatusBadge from './ListOfToggles.StatusBadge';
import ToggleDates from './ListOfToggles.ToggleDates';
import ToggleSwitch from './ListOfToggles.ToggleSwitch';

// Under the switch, on a line of its own
const PersonalSettingLine = styled.p`
  display: flex;
  flex-basis: 100%;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${tokens.spacing.sm};
  margin: 0;
  font-size: ${tokens.typography.fontSize.small};
  color: ${tokens.colors.text.secondary};
`;

const ResetLink = styled.button`
  padding: 0;
  border: none;
  background: none;
  font-family: ${tokens.typography.fontFamily};
  font-size: inherit;
  font-weight: 600;
  color: ${tokens.colors.info.text};
  text-decoration: underline;
  cursor: pointer;

  &:focus-visible {
    outline: ${tokens.focus.outline};
    box-shadow: ${tokens.focus.boxShadow};
  }
`;

type ListOfTogglesProps = {
  title: string;
  anchorId: string;
  description: string;
  emptyMessage?: string;
  onReset: () => void;
  featureFlags: FeatureFlag[];
  toggleStates: ToggleStates;
  setToggleStates: Dispatch<SetStateAction<ToggleStates>>;
};

const ListOfToggles: FunctionComponent<ListOfTogglesProps> = ({
  title,
  anchorId,
  description,
  emptyMessage,
  onReset,
  featureFlags,
  toggleStates,
  setToggleStates,
}) => {
  const hasOverrides = featureFlags.some(
    flag => toggleStates[flag.id] !== flag.defaultValue
  );

  return (
    <Group
      id={anchorId}
      title={title}
      description={description}
      isEmpty={featureFlags.length === 0}
      emptyMessage={emptyMessage}
      reset={
        hasOverrides
          ? {
              label: 'Reset to defaults',
              ariaLabel: `Reset to defaults for ${title}`,
              onClick: onReset,
            }
          : undefined
      }
    >
      <ToggleList role="list">
        {featureFlags.map(toggle => {
          const isPublicOn = toggle.defaultValue === true;
          // An experimental flag can be turned off for yourself once it's
          // public, to see the version from before it was released
          const isExperimental = toggle.type === 'experimental';
          const isLockedOn = isPublicOn && !isExperimental;
          // Whether this browser has a personal setting to reset, which isn't
          // always visible in the switch (e.g. `off` on a flag that isn't public)
          const personalSetting = isExperimental
            ? getCookie(`toggle_${toggle.id}`)
            : undefined;
          const hasPersonalSetting =
            personalSetting === 'true' || personalSetting === TOGGLE_OFF_VALUE;
          const currentState = toggleStates[toggle.id];
          const isOn = isLockedOn
            ? true
            : (currentState ?? toggle.defaultValue) === true;
          const isSeeingPreReleaseVersion =
            isExperimental && isPublicOn && !isOn;

          return (
            <ToggleListItem key={toggle.id} id={`toggle-${toggle.id}`}>
              <ToggleRow>
                <ToggleInfo>
                  <ToggleHeadingRow>
                    <ToggleDates
                      dateCreated={toggle.dateCreated}
                      dateActivated={toggle.dateActivated}
                    >
                      <ToggleTitle
                        as="h4"
                        style={{ display: 'inline' }}
                        aria-labelledby={`heading-${toggle.id}`}
                      >
                        <span id={`heading-${toggle.id}`}>{toggle.title}</span>
                      </ToggleTitle>
                    </ToggleDates>
                    <CopyLinkIcon toggleId={toggle.id} title={toggle.title} />
                    <ToggleStarButton
                      toggleId={toggle.id}
                      title={toggle.title}
                    />
                    <ToggleBadge>
                      <StatusBadge
                        active={toggle.defaultValue}
                        activeLabel="Public"
                        inactiveLabel="Internal"
                      />
                    </ToggleBadge>
                  </ToggleHeadingRow>

                  <p
                    style={{
                      margin: `${tokens.spacing.xs} 0`,
                      color: tokens.colors.text.secondary,
                    }}
                  >
                    {toggle.description}
                  </p>

                  {toggle.documentationLink && (
                    <p style={{ margin: `${tokens.spacing.xs} 0` }}>
                      <a
                        href={toggle.documentationLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Documentation
                      </a>
                    </p>
                  )}
                </ToggleInfo>

                <ToggleControls>
                  <ToggleSwitch
                    id={`switch-${toggle.id}`}
                    checked={isOn}
                    disabled={isLockedOn}
                    onChange={checked => {
                      setFeatureFlagCookie(toggle, checked);
                      setToggleStates(prev => ({
                        ...prev,
                        [toggle.id]: checked,
                      }));
                    }}
                    label={isOn ? 'On' : 'Off'}
                    name={toggle.title}
                  />
                  {(hasPersonalSetting || isSeeingPreReleaseVersion) && (
                    <PersonalSettingLine>
                      {isSeeingPreReleaseVersion && (
                        <span>
                          You&apos;re seeing the version from before this was
                          released
                        </span>
                      )}
                      {hasPersonalSetting && (
                        <ResetLink
                          type="button"
                          aria-label={`Reset to default for ${toggle.title}`}
                          onClick={() => {
                            // This link disappears once used, so keep focus on the switch
                            document
                              .getElementById(`switch-${toggle.id}`)
                              ?.focus();
                            deleteCookieCustom(toggle.id);
                            setToggleStates(prev => ({
                              ...prev,
                              [toggle.id]: toggle.defaultValue,
                            }));
                          }}
                        >
                          Reset to default
                        </ResetLink>
                      )}
                    </PersonalSettingLine>
                  )}
                  {isLockedOn && (
                    <span
                      style={{
                        fontSize: tokens.typography.fontSize.small,
                        color: tokens.colors.text.secondary,
                      }}
                    >
                      (Public override)
                    </span>
                  )}
                </ToggleControls>
              </ToggleRow>
            </ToggleListItem>
          );
        })}
      </ToggleList>
    </Group>
  );
};

export default ListOfToggles;
