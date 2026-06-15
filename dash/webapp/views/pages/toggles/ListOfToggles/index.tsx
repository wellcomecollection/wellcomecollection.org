import { Dispatch, FunctionComponent, SetStateAction } from 'react';

import { tokens } from '@weco/dash/views/themes/tokens';

import { FeatureFlag, setCookieCustom, ToggleStates } from '../toggles.helpers';
import {
  ToggleControls,
  ToggleHeadingRow,
  ToggleInfo,
  ToggleList,
  ToggleListItem,
  ToggleRow,
} from '../toggles.styles';
import CopyLinkIcon from './ListOfToggles.CopyLinkIcon';
import StatusBadge from './ListOfToggles.StatusBadge';
import ToggleDates from './ListOfToggles.ToggleDates';
import ToggleSwitch from './ListOfToggles.ToggleSwitch';

type ListOfTogglesProps = {
  title: string;
  anchorId: string;
  description?: string;
  featureFlags: FeatureFlag[];
  toggleStates: ToggleStates;
  setToggleStates: Dispatch<SetStateAction<ToggleStates>>;
};

const ListOfToggles: FunctionComponent<ListOfTogglesProps> = ({
  title,
  anchorId,
  description,
  featureFlags,
  toggleStates,
  setToggleStates,
}) => (
  <>
    <h2 id={anchorId}>
      {title}
      <a href={`#${anchorId}`} aria-label={`Link to ${title} section`}>
        <span aria-hidden="true">#</span>
      </a>
    </h2>
    {description && (
      <p style={{ marginTop: 0, color: tokens.colors.text.secondary }}>
        {description}
      </p>
    )}
    {featureFlags.length > 0 ? (
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
                      <h3 style={{ margin: 0 }} id={`heading-${toggle.id}`}>
                        <span>{toggle.title}</span>{' '}
                        <CopyLinkIcon
                          toggleId={toggle.id}
                          title={toggle.title}
                        />
                      </h3>
                    </ToggleDates>
                  </ToggleHeadingRow>

                  <div style={{ marginBottom: tokens.spacing.xs }}>
                    <StatusBadge
                      active={toggle.defaultValue}
                      activeLabel="Public"
                      inactiveLabel="Internal"
                    />
                  </div>

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
    ) : (
      <p>None for now, check back later…</p>
    )}
  </>
);

export default ListOfToggles;
