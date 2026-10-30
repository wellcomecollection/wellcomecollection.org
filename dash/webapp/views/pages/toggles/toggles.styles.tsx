import styled, { css } from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

export const TableOfContentsList = styled.ul`
  list-style: none;
  margin: 0 0 ${tokens.spacing.md};
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xs};
  font-size: ${tokens.typography.fontSize.small};

  > li > a {
    font-weight: 600;
  }
`;

/** The subsection links that follow a top-level one, inline and dot-separated. */
export const TableOfContentsSublist = styled.ul`
  display: inline;
  list-style: none;
  margin: 0;
  padding: 0;

  > li {
    display: inline;
  }

  > li::before {
    content: ' · ';
  }

  &::before {
    content: ': ';
  }
`;

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

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:hover {
    background-color: ${tokens.colors.error.main};
    color: ${tokens.colors.background.default};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media (prefers-reduced-motion: reduce) {
      transform: none;
      box-shadow: none;
    }
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
`;

/** A group within a section, boxed so it stands apart from its siblings. */
export const Subsection = styled.div<{ $isEmpty?: boolean }>`
  ${props =>
    props.$isEmpty
      ? css`
          padding: ${tokens.spacing.sm} ${tokens.spacing.lg};
        `
      : css`
          background: ${tokens.colors.background.default};
          border: 1px solid ${tokens.colors.border.default};
          border-radius: ${tokens.borderRadius.large};
          padding: ${tokens.spacing.lg};
        `}

  & + & {
    margin-top: ${tokens.spacing.md};
  }
`;

/** A group with nothing in it: its heading and a short message on one line. */
export const EmptyGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${tokens.spacing.xs} ${tokens.spacing.md};
  color: ${tokens.colors.text.secondary};
`;

/**
 * A section (h2) or subsection (h3) heading with an anchor link. Render with
 * `as` to set the heading level.
 */
export const SectionHeading = styled.h2<{
  $isSubsection?: boolean;
  $isCompact?: boolean;
}>`
  margin-top: 0;
  margin-bottom: ${props => (props.$isCompact ? '0' : tokens.spacing.md)};
  font-size: ${props => {
    if (props.$isCompact) return tokens.typography.fontSize.base;
    return props.$isSubsection
      ? tokens.typography.fontSize.h3
      : tokens.typography.fontSize.h2;
  }};
  scroll-margin-top: 60px;

  a {
    color: ${tokens.colors.info.main};
    text-decoration: none;
    margin-left: ${tokens.spacing.xs};

    &:hover {
      text-decoration: underline;
    }
  }
`;

/** The name of an individual toggle. Render with `as` to set the heading level. */
export const ToggleTitle = styled.h3`
  margin: 0;
  font-size: ${tokens.typography.fontSize.base};
`;

export const ToggleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};
  margin-bottom: ${tokens.spacing.md};
`;

export const ToggleInfo = styled.div`
  min-width: 0;

  /* Keep prose a readable length while the heading row (and its badge) spans the card */
  p {
    max-width: 70ch;
  }
`;

export const ToggleControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${tokens.spacing.sm};
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
  flex-wrap: wrap;
  align-items: center;
  gap: ${tokens.spacing.sm};
  margin-bottom: ${tokens.spacing.xs};
`;

/** Pushes a toggle's status badge to the right of its heading row. */
export const ToggleBadge = styled.div`
  margin-left: auto;
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
