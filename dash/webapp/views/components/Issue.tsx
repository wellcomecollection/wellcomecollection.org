import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

const Issue = styled.div<{
  $type: 'error' | 'warning' | 'notice' | 'success';
}>`
  padding: ${tokens.spacing.md};
  margin: ${tokens.spacing.md} 0;
  border-radius: ${tokens.borderRadius.small};
  color: ${tokens.colors.text.primary};

  ${props =>
    props.$type === 'error'
      ? `
      border: 1px solid ${tokens.colors.error.main};
      background: ${tokens.colors.error.light};
      color: ${tokens.colors.error.text};
    `
      : ''}
  ${props =>
    props.$type === 'warning'
      ? `
      border: 1px solid ${tokens.colors.warning.main};
      background: ${tokens.colors.warning.light};
      color: ${tokens.colors.warning.text};
    `
      : ''}
  ${props =>
    props.$type === 'notice'
      ? `
      border: 1px solid ${tokens.colors.info.main};
      background: ${tokens.colors.info.light};
      color: ${tokens.colors.info.text};
    `
      : ''}
  ${props =>
    props.$type === 'success'
      ? `
      border: 1px solid ${tokens.colors.success.main};
      background: ${tokens.colors.success.light};
      color: ${tokens.colors.success.text};
    `
      : ''}
`;

export default Issue;
