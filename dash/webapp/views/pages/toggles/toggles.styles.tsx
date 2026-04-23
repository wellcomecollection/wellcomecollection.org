import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

export const ResetButton = styled.button`
  border: 2px solid ${tokens.colors.error.main};
  background-color: ${tokens.colors.error.light};
  color: ${tokens.colors.error.text};
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  margin: ${tokens.spacing.sm} 0;
  font-size: 1.03rem;
  font-family: ${tokens.typography.fontFamily};
  font-weight: 500;
  border-radius: ${tokens.borderRadius.small};
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background-color: ${tokens.colors.error.main};
    color: ${tokens.colors.background.default};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:focus-visible {
    outline: ${tokens.focus.outline};
    box-shadow: ${tokens.focus.boxShadow};
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  font-size: ${tokens.typography.fontSize.base};
  font-family: ${tokens.typography.fontFamily};
  border: 2px solid ${tokens.colors.border.default};
  border-radius: ${tokens.borderRadius.medium};
  margin-bottom: ${tokens.spacing.md};
  transition: border-color 150ms ease;

  &:focus-visible {
    outline: 0.3rem double ${tokens.colors.primary.dark};
    box-shadow: 0 0 0 0.3rem ${tokens.colors.background.default};
    border-color: ${tokens.colors.primary.dark};
  }

  &::placeholder {
    color: ${tokens.colors.text.disabled};
  }
`;

export const Section = styled.section<{
  $background?: 'default' | 'light' | 'alt';
  $hasNoTopPadding?: boolean;
}>`
  padding: ${props => (props.$hasNoTopPadding ? '0' : tokens.spacing.xl)} 0
    ${tokens.spacing.xl};
  background: ${props => {
    switch (props.$background) {
      case 'light':
        return tokens.colors.background.paper;
      case 'alt':
        return tokens.colors.background.section;
      default:
        return 'transparent';
    }
  }};
`;

export const SectionInner = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${tokens.spacing.xl};

  h2 {
    margin-top: 0;
    margin-bottom: ${tokens.spacing.md};
    font-size: ${tokens.typography.fontSize.h4};
    scroll-margin-top: 60px;
  }
`;

export const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${tokens.spacing.md};
  margin-bottom: ${tokens.spacing.md};
`;

export const ToggleInfo = styled.div`
  flex: 1;
  min-width: 0;
  max-width: 500px;
`;

export const ToggleControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${tokens.spacing.xs};
  flex-shrink: 0;
`;

export const ToggleList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const ToggleListItem = styled.li`
  margin-top: ${tokens.spacing.md};
  border-top: 1px solid ${tokens.colors.border.default};
  padding-top: ${tokens.spacing.md};
`;

export const ToggleHeadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  margin-bottom: ${tokens.spacing.xs};
`;

export const MessageBox = styled.p<{
  $isError?: boolean;
  $isEnabled?: boolean;
}>`
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  margin: 0;
  border-radius: ${tokens.borderRadius.small};
  margin-bottom: ${tokens.spacing.md};
  font-weight: bold;
  border: 1px solid
    ${props => {
      if (props.$isError) return tokens.colors.error.main;
      return props.$isEnabled
        ? tokens.colors.success.main
        : tokens.colors.info.main;
    }};
  background-color: ${props => {
    if (props.$isError) return tokens.colors.error.light;
    return props.$isEnabled
      ? tokens.colors.success.light
      : tokens.colors.info.light;
  }};
  color: ${props => {
    if (props.$isError) return tokens.colors.error.text;
    return props.$isEnabled
      ? tokens.colors.success.text
      : tokens.colors.info.text;
  }};
`;
