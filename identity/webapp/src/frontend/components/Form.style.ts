import { FieldError } from 'react-hook-form';
import styled from 'styled-components';
import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';

export const FieldMargin = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom'] },
})``;

export const Label = styled.label.attrs({ className: font('intr', 4) })`
  display: block;
  font-weight: bold;
`;

export const TextInput = styled.input<{ invalid?: FieldError }>`
  width: 100%;
  height: 55px;
  margin: 0.333em 0;
  padding: 0.7em;
  border: ${props =>
    props.invalid ? 'solid 2px #d1192c' : 'solid 1px #8f8f8f'};
  border-radius: 6px;
`;

export const Button = styled(SolidButton)`
  justify-content: center;
`;

export const Cancel = styled.a.attrs({ href: '#cancel' })`
  display: block;
  text-align: center;
  padding-top: 1em;
`;
