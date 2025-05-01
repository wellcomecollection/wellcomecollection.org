import styled, { css } from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const ProgressBar = styled(Space).attrs({
  $v: { size: 'm', properties: ['margin-bottom'] },
})`
  background-color: ${props => props.theme.color('white')};
  border-radius: 7px; /* (height of inner div) / 2 + padding */
  border: 2px solid black;
  width: 300px;
  max-width: 100%;
`;

export const ProgressIndicator = styled.div<{ $percentage: number }>`
  background-color: ${props => props.theme.color('black')};
  width: ${props => `${props.$percentage}%`};
  height: 10px;
`;

export const ButtonWrapper = styled(Space).attrs({
  as: 'span',
  $v: { size: 'l', properties: ['margin-bottom'] },
  $h: { size: 'l', properties: ['margin-right'] },
})`
  display: inline-block;
`;

export const ButtonAlign = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 1em;
`;

export const ModalContainer = styled.aside`
  ${props => props.theme.media('medium')`
    width: 24em;
  `}
`;

export const ItemTitle = styled.span`
  display: inline-block;
  min-width: 300px;
  max-width: 600px;

  ${props => props.theme.media('large', 'max-width')`
    min-width: 100%;
  `}
`;

export const ItemStatus = styled.span`
  white-space: nowrap;
`;

export const ItemPickup = styled.span`
  white-space: nowrap;
`;

export const ModalTitle = styled(Space).attrs({
  as: 'h2',
  className: font('wb', 3),
  $v: { size: 'l', properties: ['margin-bottom'] },
})``;

const colours = {
  success: css`
    background-color: rgb(0, 120, 108, 0.1);
    border: 1px solid rgb(0, 120, 108, 0.3);
    color: ${props => props.theme.color('black')};
  `,
  failure: css`
    background-color: rgb(224, 27, 47, 0.1);
    border: 1px solid rgb(224, 27, 47, 0.3);
    color: ${props => props.theme.color('validation.red')};
  `,
  info: css`
    background-color: rgb(255, 206, 60, 0.2);
    border: 1px solid rgb(255, 206, 60, 0.4);
    color: #705400;
  `,
};

export type StatusAlertProps = { type: keyof typeof colours };
export const StatusAlert = styled(Space).attrs<StatusAlertProps>({
  role: 'alert',
  $v: {
    size: 'l',
    properties: ['margin-bottom', 'padding-top', 'padding-bottom'],
  },
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
})<StatusAlertProps>`
  ${props => colours[props.type]}
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  display: flex;
  align-items: center;
`;

export const Section = styled.section`
  border-top: 1px solid ${props => props.theme.color('warmNeutral.400')};
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1em;
  align-items: center;
  padding: 1em 0;

  ${props => props.theme.media('medium')`
    grid-template-columns: 3fr 2fr;
  `}

  & > h2 {
    grid-column: 1 / -1;
  }
`;

export const StyledDl = styled(Space).attrs({
  as: 'dl',
  $v: { size: 'l', properties: ['margin-bottom'] },
})`
  margin-top: 0;
`;

export const StyledDd = styled(Space).attrs({
  as: 'dd',
  $v: { size: 'm', properties: ['margin-bottom'] },
})`
  margin-left: 0;
`;
