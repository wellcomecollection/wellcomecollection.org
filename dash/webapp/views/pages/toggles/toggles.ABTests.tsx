import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

import Group from './toggles.Group';
import {
  deleteCookieCustom,
  setCookieCustom,
  ToggleStates,
} from './toggles.helpers';
import ToggleStarButton from './toggles.StarButton';
import { ToggleList, ToggleListItem, ToggleTitle } from './toggles.styles';

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
  onReset,
}: {
  filteredAbTests: AbTest[];
  toggleStates: ToggleStates;
  setToggleStates: React.Dispatch<React.SetStateAction<ToggleStates>>;
  onReset: () => void;
}) => {
  const hasOverrides = filteredAbTests.some(
    test => toggleStates[test.id] !== undefined
  );

  return (
    <Group
      id="ab-tests"
      title="A/B tests"
      description="You can opt in to a test, explicitly opt out, or be randomly allocated according to our A/B decision rules."
      isEmpty={filteredAbTests.length === 0}
      emptyMessage="No A/B tests running right now."
      reset={
        hasOverrides
          ? {
              label: 'Reset to random allocation',
              ariaLabel: 'Reset to random allocation for all A/B tests',
              onClick: onReset,
            }
          : undefined
      }
    >
      <ToggleList>
        {filteredAbTests.map(toggle => {
          const value = toggleStates[toggle.id];
          return (
            <ToggleListItem
              key={toggle.id}
              style={{ paddingTop: tokens.spacing.sm }}
            >
              <ToggleTitle
                as="h4"
                style={{
                  marginRight: tokens.spacing.sm,
                  marginBottom: tokens.spacing.xs,
                }}
              >
                <span id={`toggle-${toggle.id}`}>
                  {toggle.title}{' '}
                  <span
                    style={{
                      fontSize: tokens.typography.fontSize.small,
                      color: tokens.colors.text.secondary,
                    }}
                  >
                    ({toggle.range[0]} - {toggle.range[1]})
                  </span>
                </span>{' '}
                <ToggleStarButton toggleId={toggle.id} title={toggle.title} />
              </ToggleTitle>

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
    </Group>
  );
};

export default ABTests;
