import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';
import { ModeDefinition } from '@weco/toggles';

import CopyLinkIcon from './ListOfToggles/ListOfToggles.CopyLinkIcon';
import { deleteCookieCustom, setCookieCustom } from './toggles.helpers';
import {
  ResetButton,
  ToggleControls,
  ToggleInfo,
  ToggleList,
  ToggleListItem,
  ToggleRow,
} from './toggles.styles';

const ModeSelect = styled.select`
  padding: 6px;
  max-width: 300px;
`;

const ModeControlRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${tokens.spacing.xs};
`;

type ModesProps = {
  modes: ModeDefinition[];
  modeStates: Record<string, string>;
  setModeStates: Dispatch<SetStateAction<Record<string, string>>>;
  onReset: () => void;
};

const Modes: FunctionComponent<ModesProps> = ({
  modes,
  modeStates,
  setModeStates,
  onReset,
}) => (
  <>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h2 id="modes">
        Modes
        <a href="#modes" aria-label="Link to this section">
          <span aria-hidden="true">#</span>
        </a>
      </h2>
      <ResetButton
        onClick={onReset}
        aria-label="Reset all modes to off"
        disabled={Object.keys(modeStates).length === 0}
        style={{
          visibility: Object.keys(modeStates).length > 0 ? 'visible' : 'hidden',
        }}
      >
        Reset all modes
      </ResetButton>
    </div>
    <p style={{ marginTop: 0, color: tokens.colors.text.secondary }}>
      Modes carry structured data beyond a simple on/off, they might represent
      different levels of a feature, or a choice between multiple options.
    </p>
    {modes.length > 0 ? (
      <ToggleList>
        {modes.map(mode => {
          const rawValue = modeStates[mode.id];
          const currentValue = mode.options.some(opt => opt.id === rawValue)
            ? rawValue
            : '';

          return (
            <ToggleListItem key={mode.id}>
              <ToggleRow>
                <ToggleInfo>
                  <h3 id={`mode-${mode.id}`} style={{ margin: 0 }}>
                    {mode.title}
                  </h3>
                  {mode.description.split('\n\n').map((paragraph, i) => (
                    <p
                      key={i}
                      style={{
                        margin: `${tokens.spacing.xs} 0`,
                        color: tokens.colors.text.secondary,
                      }}
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                    />
                  ))}
                </ToggleInfo>

                <ToggleControls>
                  <ModeControlRow>
                    <span
                      style={{
                        visibility: currentValue ? 'visible' : 'hidden',
                      }}
                    >
                      <CopyLinkIcon
                        toggleId={mode.id}
                        title={mode.title}
                        modeValue={currentValue}
                      />
                    </span>
                    <ModeSelect
                      aria-labelledby={`mode-${mode.id}`}
                      value={currentValue}
                      onChange={e => {
                        const value = e.target.value;
                        if (value) {
                          setModeStates(prev => ({
                            ...prev,
                            [mode.id]: value,
                          }));
                          setCookieCustom(mode.id, value);
                        } else {
                          setModeStates(prev => {
                            const next = { ...prev };
                            delete next[mode.id];
                            return next;
                          });
                          deleteCookieCustom(mode.id);
                        }
                      }}
                    >
                      <option value="">— Off —</option>
                      {mode.options.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </ModeSelect>
                  </ModeControlRow>
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

export default Modes;
