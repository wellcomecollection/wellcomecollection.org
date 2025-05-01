import { FieldError } from 'react-hook-form';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { StyledButton } from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';

export const FieldMargin = styled(Space).attrs({
  $v: { size: 'm', properties: ['margin-bottom'] },
})``;

export const Label = styled.label.attrs({ className: font('intr', 4) })`
  display: block;
  font-weight: bold;
`;

export const TextInput = styled.input<{ $invalid?: FieldError }>`
  width: 100%;
  height: 55px;
  margin: 0.333em 0;
  padding: 0.7em;
  border: solid
    ${props =>
      props.$invalid
        ? `2px ${props.theme.color('validation.red')}`
        : `1px ${props.theme.color('neutral.500')}`};
  border-radius: 6px;
`;

export const Button = styled(StyledButton)`
  justify-content: center;
`;

export const Cancel = styled.a.attrs({ href: '#cancel' })`
  display: block;
  text-align: center;
  padding-top: 1em;
`;
