import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import { FieldError } from 'react-hook-form';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

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

export const ExternalLink = styled.a`
  white-space: nowrap;
`;

export const Button = styled(SolidButton)`
  width: 100%;
  justify-content: center;
`;

export const InvalidFieldAlert = styled.span.attrs({ role: 'alert', className: 'font-hnl' })`
  color: #d1192c;
  font-weight: bold;
`;

const AlertBox = styled.div.attrs({ role: 'alert', className: 'font-hnl' })`
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;

  & svg {
    stroke: currentColor;
    fill: currentColor;
  }
`;

export const ErrorAlert = styled(AlertBox)`
  background-color: rgba(224, 27, 47, 0.1);
  color: #d1192c;
`;

export const SuccessMessage = styled(AlertBox)`
  background-color: rgba(0, 120, 108, 0.1);
  color: #00786c;
`;

export const PasswordRulesList = styled.ul`
  margin-top: -0.666em;
`;

export const Checkbox = styled(CheckboxRadio).attrs({ type: 'checkbox' })``;

export const CheckboxLabel = styled.span`
  margin-left: 0.333em;
`;

const FullWidthElementBase = css`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InProgress = styled.div.attrs({ role: 'progressbar' })`
  ${FullWidthElementBase}
  border-radius: 6px;
  background-color: #333;
  color: white;
  user-select: none;
`;

export const Cancel = styled(Link).attrs({ children: 'Cancel', to: '#cancel' })`
  ${FullWidthElementBase}
`;
