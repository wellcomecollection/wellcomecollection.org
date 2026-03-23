import { Dispatch, FunctionComponent, SetStateAction } from 'react';

import { tokens } from '@weco/dash/views/themes/tokens';

import { setCookieCustom, Toggle, ToggleStates } from '../toggles.helpers';
import CopyLinkIcon from './ListOfToggles.CopyLinkIcon';
import StatusBadge from './ListOfToggles.StatusBadge';
import ToggleSwitch from './ListOfToggles.ToggleSwitch';
import {
  ToggleControls,
  ToggleHeadingRow,
  ToggleInfo,
  ToggleList,
  ToggleListItem,
  ToggleRow,
} from '../toggles.styles';

type ListOfTogglesProps = {
  toggles: Toggle[];
  toggleStates: ToggleStates;
  setToggleStates: Dispatch<SetStateAction<ToggleStates>>;
};

const ListOfToggles: FunctionComponent<ListOfTogglesProps> = ({
  toggles,
  toggleStates,
  setToggleStates,
}) => (
  <>
    {toggles.length > 0 ? (
      <ToggleList>
        {toggles.map(toggle => {
          const isPublicOn = toggle.defaultValue === true;
          const currentState = toggleStates[toggle.id];
          const isOn = currentState === true;

          return (
            <ToggleListItem key={toggle.id} id={`toggle-${toggle.id}`}>
              <ToggleRow>
                <ToggleInfo>
                  <ToggleHeadingRow>
                    <h3
                      style={{ margin: 0 }}
                      aria-labelledby={`heading-${toggle.id}`}
                    >
                      <span id={`heading-${toggle.id}`}>{toggle.title}</span>{' '}
                      <CopyLinkIcon toggleId={toggle.id} title={toggle.title} />
                    </h3>
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
                    id={`toggle-switch-${toggle.id}`}
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
                        color: tokens.colors.text.disabled,
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
