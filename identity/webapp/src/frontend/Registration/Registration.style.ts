import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import { FieldError } from 'react-hook-form';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  background-color: white;
  max-width: 782px;
  margin: 0 auto;

  @media screen and (min-width: 600px) {
    margin: 64px auto;
    border-radius: 10px;
    padding-top: 1em;
  }
`;

export const Wrapper = styled.div`
  max-width: 423px;
  margin: 0 auto;
  padding: 1em;
`;

export const Title = styled.h1.attrs({ className: 'font-wb font-size-2' })``;

export const FieldMargin = styled.div`
  margin-bottom: 1em;
`;

export const Label = styled.label.attrs({ className: 'font-hnm font-size-4' })`
  display: block;
  font-weight: bold;
`;

export const TextInput = styled.input<{ invalid?: FieldError }>`
  width: 100%;
  height: 55px;
  margin: 0.333em 0;
  padding: 0.7em;
  border: ${props => (props.invalid ? 'solid 2px #d1192c' : 'solid 1px #8f8f8f')};
`;

export const Link = styled.a`
  white-space: nowrap;
`;

const BaseButton = css`
  width: 100%;
  justify-content: center;
`;

export const Button = styled(SolidButton)`
  ${BaseButton}
`;

export const SecondaryButton = styled(OutlinedButton)`
  ${BaseButton}
`;

export const InvalidFieldAlert = styled.span.attrs({ role: 'alert', className: 'font-hnm' })`
  color: #d1192c;
`;

const AlertBox = styled.div.attrs({ role: 'alert', className: 'font-hnm' })`
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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

export const Checkbox = styled(CheckboxRadio).attrs({ type: 'checkbox' })`
  & > div {
    margin-right: 0.666em;
  }
`;
