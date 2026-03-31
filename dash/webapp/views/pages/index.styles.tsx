import Link from 'next/link';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: ${tokens.spacing.lg};
  margin: ${tokens.spacing.xl} 0;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const Card = styled(Link)`
  display: block;
  padding: ${tokens.spacing.lg};
  border: 2px solid ${tokens.colors.border.default};
  border-radius: ${tokens.borderRadius.medium};
  background: ${tokens.colors.background.default};
  text-decoration: none;
  color: inherit;
  transition: all 200ms ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${tokens.colors.info.main};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const CardTitle = styled.h2`
  margin: 0 0 ${tokens.spacing.xs};
  font-size: ${tokens.typography.fontSize.large};
  color: ${tokens.colors.black};
`;

export const CardDescription = styled.p`
  margin: 0 0 ${tokens.spacing.md};
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.fontSize.base};
  line-height: 1.5;
`;

export const CardStatus = styled.div<{
  $type: 'success' | 'error' | 'neutral';
}>`
  display: inline-flex;
  align-items: center;
  padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
  border-radius: ${tokens.borderRadius.small};
  font-size: ${tokens.typography.fontSize.small};
  font-weight: 600;
  background: ${props => {
    if (props.$type === 'success') return tokens.colors.success.light;
    if (props.$type === 'error') return tokens.colors.error.light;
    return tokens.colors.background.paper;
  }};
  color: ${props => {
    if (props.$type === 'success') return tokens.colors.success.text;
    if (props.$type === 'error') return tokens.colors.error.text;
    return tokens.colors.text.secondary;
  }};
  border: 1px solid
    ${props => {
      if (props.$type === 'success') return tokens.colors.success.main;
      if (props.$type === 'error') return tokens.colors.error.main;
      return tokens.colors.border.default;
    }};
`;

export const LinksSection = styled.div`
  margin-top: ${tokens.spacing.xl};
  padding-top: ${tokens.spacing.xl};
  border-top: 1px solid ${tokens.colors.border.default};
`;
