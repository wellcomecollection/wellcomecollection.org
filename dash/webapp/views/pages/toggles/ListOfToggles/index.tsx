import { Dispatch, FunctionComponent, SetStateAction } from 'react';

import { tokens } from '@weco/dash/views/themes/tokens';

import Group from '../toggles.Group';
import { FeatureFlag, setCookieCustom, ToggleStates } from '../toggles.helpers';
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
          const currentState = toggleStates[toggle.id];
          const isOn = isPublicOn
            ? true
            : (currentState ?? toggle.defaultValue) === true;

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
                    checked={isOn}
                    disabled={isPublicOn}
                    onChange={checked => {
                      if (checked) {
                        setCookieCustom(toggle.id, 'true');
                      } else {
                        setCookieCustom(toggle.id, 'false');
                      }
                      setToggleStates(prev => ({
                        ...prev,
                        [toggle.id]: checked,
                      }));
                    }}
                    label={isOn ? 'On' : 'Off'}
                    name={toggle.title}
                  />
                  {isPublicOn && (
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
