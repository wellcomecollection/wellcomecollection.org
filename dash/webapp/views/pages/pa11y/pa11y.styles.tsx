import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

export const Pre = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
  background: ${tokens.colors.background.paper};
  color: ${tokens.colors.text.primary};
  margin: ${tokens.spacing.sm} 0;
  padding: ${tokens.spacing.sm};
  border-radius: ${tokens.borderRadius.small};
  border: 1px solid ${tokens.colors.border.default};
`;

export const OriginalPageLink = styled.a`
  color: ${tokens.colors.text.primary};
  text-decoration: underline;
  transition: color 150ms ease;

  &:hover {
    color: ${tokens.colors.primary.dark};
    text-decoration: none;
  }
`;

export const Description = styled.p`
  margin-top: 0;
  font-weight: bold;
`;
