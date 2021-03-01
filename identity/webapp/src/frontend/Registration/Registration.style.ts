import { SolidButton } from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import styled from 'styled-components';

export const Container = styled.div`
  background-color: white;
  max-width: 782px;
  margin: 0 auto;

  @media screen and (min-width: 600px) {
    margin-top: 64px;
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

export const Button = styled(SolidButton)`
  width: 100%;
  justify-content: center;
`;

export const InvalidFieldAlert = styled.span.attrs({ role: 'alert', className: 'font-hnm' })`
  color: #d1192c;
`;

export const ErrorMessage = styled.div.attrs({ role: 'alert', className: 'font-hnm' })`
  background-color: rgba(224, 27, 47, 0.1);
  color: #d1192c;
  padding: 1em;
  text-align: center;
`;
