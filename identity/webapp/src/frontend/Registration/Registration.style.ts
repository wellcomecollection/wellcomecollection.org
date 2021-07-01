import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import styled, { css } from 'styled-components';

export const ExternalLink = styled.a`
  white-space: nowrap;
`;

const AlertBox = styled.div.attrs({ role: 'alert', className: 'font-hnr' })`
  padding: 1em 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  text-align: center;
  gap: 0.5em;

  & svg {
    stroke: currentColor;
    fill: currentColor;
    height: 32px;
    width: 32px;
  }
`;

export const ErrorAlert = styled(AlertBox)`
  background-color: rgba(224, 27, 47, 0.1);
  color: #d1192c;
`;

export const SuccessMessage = styled(AlertBox)`
  background-color: rgba(0, 120, 108, 0.1);
  color: ${props => props.theme.color('green')};
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

export const Cancel = styled.button.attrs({ type: 'button', children: 'Cancel' })`
  ${FullWidthElementBase}
  width: fit-content;
  margin: 0 auto;
  background: none;
  border: none;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
    cursor: pointer;
  }
`;
