import { Dispatch, FunctionComponent, SetStateAction } from 'react';

import { tokens } from '@weco/dash/views/themes/tokens';

import { FeatureFlag, setCookieCustom, ToggleStates } from '../toggles.helpers';
import ToggleStarButton from '../toggles.StarButton';
import {
  EmptyGroup,
  SectionHeading,
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
  description?: string;
  emptyMessage?: string;
  featureFlags: FeatureFlag[];
  toggleStates: ToggleStates;
  setToggleStates: Dispatch<SetStateAction<ToggleStates>>;
};

const ListOfToggles: FunctionComponent<ListOfTogglesProps> = ({
  title,
  anchorId,
  description,
  emptyMessage = 'None for now, check back later…',
  featureFlags,
  toggleStates,
  setToggleStates,
}) => {
  const isEmpty = featureFlags.length === 0;
  const heading = (
    <SectionHeading as="h3" $isCompact={isEmpty} id={anchorId} $isSubsection>
      {title}
      <a href={`#${anchorId}`} aria-label={`Link to ${title} section`}>
        <span aria-hidden="true">#</span>
      </a>
    </SectionHeading>
  );

  if (isEmpty) {
    return (
      <EmptyGroup>
        {heading}
        <span>{emptyMessage}</span>
      </EmptyGroup>
    );
  }

  return (
    <>
      {heading}
      {description && (
        <p style={{ marginTop: 0, color: tokens.colors.text.secondary }}>
          {description}
        </p>
      )}
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
    </>
  );
};

export default ListOfToggles;
