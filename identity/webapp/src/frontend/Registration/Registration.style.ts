import { OutlinedButton } from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
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

export const Heading = styled.h2.attrs({ className: 'font-hnm font-size-3' })``;

export const Label = styled.label.attrs({ className: 'font-hnm font-size-4' })`
  display: block;
`;

export const TextInput = styled.input`
  width: 100%;
  margin: 0.333em 0;
  padding: 1em;
  border: solid 1px #8f8f8f;

  &[data-invalid='true'] {
    border: solid 2px #d1192c;
  }
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

const AlertBox = styled.div.attrs({ role: 'alert', className: 'font-hnm font-size-5' })`
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

export const ErrorMessage = styled(AlertBox)`
  background-color: rgba(224, 27, 47, 0.1);
  color: #d1192c;
`;

export const SuccessMessage = styled(AlertBox)`
  background-color: rgba(0, 120, 108, 0.1);
  color: #00786c;
`;
