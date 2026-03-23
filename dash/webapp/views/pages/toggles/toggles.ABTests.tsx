import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

import {
  deleteCookieCustom,
  setCookieCustom,
  ToggleStates,
} from './toggles.helpers';
import { ToggleList, ToggleListItem } from './toggles.styles';

const RadioGroup = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
  margin-top: ${tokens.spacing.sm};
`;

const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
  margin-right: ${tokens.spacing.lg};
  cursor: pointer;
  font-size: ${tokens.typography.fontSize.base};

  input[type='radio'] {
    accent-color: ${tokens.colors.primary.dark};
    width: 1rem;
    height: 1rem;
    cursor: pointer;
  }
`;

export type AbTest = {
  id: string;
  title: string;
  range: [number, number];
  defaultValue: boolean;
  description: string;
  type: 'stage';
};
const ABTests = ({
  filteredAbTests,
  toggleStates,
  setToggleStates,
}: {
  filteredAbTests: AbTest[];
  toggleStates: ToggleStates;
  setToggleStates: React.Dispatch<React.SetStateAction<ToggleStates>>;
}) => {
  return (
    <>
      <h2>A/B tests</h2>
      <p>
        You can opt in to a test, explicitly opt out, or be randomly allocated
        according to our A/B decision rules.
      </p>

      {filteredAbTests.length > 0 ? (
        <ToggleList>
          {filteredAbTests.map(toggle => {
            const value = toggleStates[toggle.id];
            return (
              <ToggleListItem
                key={toggle.id}
                style={{ paddingTop: tokens.spacing.sm }}
              >
                <h3
                  style={{
                    marginRight: tokens.spacing.sm,
                    marginBottom: tokens.spacing.xs,
                  }}
                  id={`toggle-${toggle.id}`}
                >
                  {toggle.title}{' '}
                  <span
                    style={{
                      fontSize: tokens.typography.fontSize.small,
                      color: tokens.colors.text.secondary,
                    }}
                  >
                    ({toggle.range[0]} - {toggle.range[1]})
                  </span>
                </h3>

                <p>{toggle.description}</p>

                <RadioGroup aria-labelledby={`toggle-${toggle.id}`}>
                  <RadioLabel>
                    <input
                      type="radio"
                      name={`ab-${toggle.id}`}
                      checked={value === true}
                      onChange={() => {
                        setCookieCustom(toggle.id, 'true');
                        setToggleStates(prev => ({
                          ...prev,
                          [toggle.id]: true,
                        }));
                      }}
                    />
                    Count me in
                  </RadioLabel>

                  <RadioLabel>
                    <input
                      type="radio"
                      name={`ab-${toggle.id}`}
                      checked={value === false}
                      onChange={() => {
                        setCookieCustom(toggle.id, 'false');
                        setToggleStates(prev => ({
                          ...prev,
                          [toggle.id]: false,
                        }));
                      }}
                    />
                    No thanks
                  </RadioLabel>

                  <RadioLabel>
                    <input
                      type="radio"
                      name={`ab-${toggle.id}`}
                      checked={value === undefined}
                      onChange={() => {
                        deleteCookieCustom(toggle.id);
                        setToggleStates(prev => ({
                          ...prev,
                          [toggle.id]: undefined,
                        }));
                      }}
                    />
                    Randomly allocate me
                  </RadioLabel>
                </RadioGroup>
              </ToggleListItem>
            );
          })}
        </ToggleList>
      ) : (
        <p>None for now, check back later…</p>
      )}
    </>
  );
};

export default ABTests;
