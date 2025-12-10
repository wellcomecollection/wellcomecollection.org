import styled, { css } from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';

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
    size: 'md',
    properties: ['margin-bottom', 'padding-top', 'padding-bottom'],
  },
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
})<StatusAlertProps>`
  ${props => colours[props.type]}
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  display: flex;
  align-items: center;
`;
