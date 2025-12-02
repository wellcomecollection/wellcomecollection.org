import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { check } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

const RulesListItem = styled(Space).attrs({
  as: 'li',
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  display: flex;
  align-items: center;
`;

const RulesListWrapper = styled(Space).attrs({
  className: font('sans', -1),
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  border: 1px solid ${props => props.theme.color('neutral.300')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
`;

const RuleDot = styled.span<{ $isValid: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.color('neutral.300')};
  background: ${props =>
    props.theme.color(props.$isValid ? 'accent.green' : 'white')};

  .icon {
    transform: scale(0.8);
  }
`;

const Dot: FunctionComponent<{
  isValid: boolean;
}> = ({ isValid }) => {
  return (
    <Space $h={{ size: 's', properties: ['margin-right'] }}>
      <RuleDot $isValid={isValid}>
        {isValid && <Icon icon={check} matchText iconColor="white" />}
      </RuleDot>
    </Space>
  );
};

export type PasswordRulesProps = {
  isAtLeast8Characters: boolean;
  hasLowercaseLetters: boolean;
  hasUppercaseLetters: boolean;
  hasNumbers: boolean;
};

const PasswordRules: FunctionComponent<PasswordRulesProps> = ({
  isAtLeast8Characters,
  hasLowercaseLetters,
  hasUppercaseLetters,
  hasNumbers,
}) => {
  return (
    <RulesListWrapper data-component="password-rules">
      <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
        Your password must contain:
      </Space>
      <PlainList>
        <RulesListItem>
          <Dot isValid={isAtLeast8Characters} />
          At least 8 characters
        </RulesListItem>
        <RulesListItem>
          <Dot isValid={hasLowercaseLetters} />
          Lowercase letters (a-z)
        </RulesListItem>
        <RulesListItem>
          <Dot isValid={hasUppercaseLetters} />
          Uppercase letters (A-Z)
        </RulesListItem>
        <RulesListItem>
          <Dot isValid={hasNumbers} />
          Numbers (0-9)
        </RulesListItem>
      </PlainList>
    </RulesListWrapper>
  );
};

export default PasswordRules;
