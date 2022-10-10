import React, { FC } from 'react';
import {
  RulesList,
  RulesListItem,
  RulesListWrapper,
} from './PasswordInput.style';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import { check } from '@weco/common/icons';
import styled from 'styled-components';

type DotProps = {
  isValid: boolean;
};

const RuleDot = styled.span<DotProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.color('neutral.300')};
  background: ${props =>
    props.theme.color(props.isValid ? 'accent.green' : 'white')};

  .icon {
    transform: scale(0.8);
  }
`;

const Dot: FC<DotProps> = ({ isValid }) => {
  return (
    <Space h={{ size: 's', properties: ['margin-right'] }}>
      <RuleDot isValid={isValid}>
        {isValid && <Icon icon={check} matchText color={'white'} />}
      </RuleDot>
    </Space>
  );
};

type Props = {
  isAtLeast8Characters: boolean;
  hasLowercaseLetters: boolean;
  hasUppercaseLetters: boolean;
  hasNumbers: boolean;
};

export const PasswordRules: React.FC<Props> = ({
  isAtLeast8Characters,
  hasLowercaseLetters,
  hasUppercaseLetters,
  hasNumbers,
}) => {
  return (
    <RulesListWrapper>
      <Space v={{ size: 's', properties: ['margin-bottom'] }}>
        Your password must contain:
      </Space>
      <RulesList>
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
      </RulesList>
    </RulesListWrapper>
  );
};
