import styled, { css } from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';

export const ExternalLink = styled.a`
  white-space: nowrap;
`;

const AlertBox = styled.div.attrs({ role: 'alert', className: 'font-intr' })`
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
  background-color: rgb(224, 27, 47, 0.1);
  color: ${props => props.theme.color('validation.red')};
`;

export const SuccessMessage = styled(AlertBox)`
  background-color: rgb(0, 120, 108, 0.1);
  color: ${props => props.theme.color('validation.green')};
`;

export const HighlightMessage = styled(Space).attrs({
  as: 'p',
  $h: { size: 'm', properties: ['padding-left'] },
})`
  border-left: 13px solid ${props => props.theme.color('yellow')};
`;

export const CheckboxLabel = styled.div`
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
  background-color: ${props => props.theme.color('neutral.700')};
  color: white;
  user-select: none;
`;

export const Cancel = styled.button.attrs({
  type: 'button',
  children: 'Cancel',
})`
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

export const YellowBorder = styled(Space).attrs({
  $h: { size: 's', properties: ['padding-left'] },
})`
  border-left: 10px solid ${props => props.theme.color('yellow')};
`;

export const FullWidthButton = styled.div`
  * {
    width: 100%;
  }
`;

export const FlexStartCheckbox = styled.div`
  label {
    align-items: flex-start;
  }
`;
