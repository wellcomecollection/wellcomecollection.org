import { FieldError } from 'react-hook-form';
import styled, { css } from 'styled-components';
import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';

export const FieldMargin = styled.div`
  margin-bottom: 1em;
`;

export const Label = styled.label.attrs({ className: 'font-hnl fonts-loaded font-size-4' })`
  display: block;
  font-weight: bold;
`;

export const TextInput = styled.input<{ invalid?: FieldError }>`
  width: 100%;
  height: 55px;
  margin: 0.333em 0;
  padding: 0.7em;
  border: ${props => (props.invalid ? 'solid 2px #d1192c' : 'solid 1px #8f8f8f')};
  border-radius: 6px;
`;

export const InvalidFieldAlert = styled.span.attrs({ role: 'alert', className: 'font-hnl' })`
  color: #d1192c;
  font-weight: bold;
`;

export const DangerButtonModifier = css`
  background-color: #d1192c;
  border-color: #d1192c;

  &:not([disabled]):hover {
    background-color: #b80013;
    border-color: #b80013;
  }
`;

export const Button = styled(SolidButton)`
  width: 100%;
  justify-content: center;

  ${props => props.isDangerous && DangerButtonModifier}
`;

export const Cancel = styled.a.attrs({ href: '#cancel' })`
  display: block;
  text-align: center;
  padding-top: 1em;
`;
