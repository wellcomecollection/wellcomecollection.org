import { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

import ResetIcon from './toggles.ResetIcon';
import {
  EmptyGroup,
  RESET_BUTTON_HEIGHT,
  ResetButton,
  SectionHeading,
  Subsection,
} from './toggles.styles';

const GroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* Tall enough for the reset button, so it appearing doesn't move anything */
  min-height: ${RESET_BUTTON_HEIGHT};
  margin-bottom: ${tokens.spacing.md};

  > h2,
  > h3 {
    margin-bottom: 0;
  }
`;

type GroupProps = {
  id: string;
  title: string;
  description: ReactNode;
  isEmpty: boolean;
  emptyMessage?: string;
  /** Only pass when there's something to reset */
  reset?: { label: string; ariaLabel: string; onClick: () => void };
  /** A section's own heading (h2) with no box, rather than a boxed group (h3) */
  isSection?: boolean;
  children: ReactNode;
};

/**
 * A boxed group of toggles within a section, which shrinks to one line when
 * it has none.
 */
const Group: FunctionComponent<GroupProps> = ({
  id,
  title,
  description,
  isEmpty,
  emptyMessage = 'None for now, check back later…',
  reset,
  isSection,
  children,
}) => {
  const heading = (
    <SectionHeading
      as={isSection ? 'h2' : 'h3'}
      id={id}
      $isCompact={isEmpty}
      $isSubsection={!isSection}
    >
      <a href={`#${id}`}>{title}</a>
    </SectionHeading>
  );

  const content = isEmpty ? (
    <EmptyGroup>
      {heading}
      <span>{emptyMessage}</span>
    </EmptyGroup>
  ) : (
    <>
      <GroupHeader>
        {heading}
        {reset && (
          <ResetButton onClick={reset.onClick} aria-label={reset.ariaLabel}>
            <ResetIcon />
            {reset.label}
          </ResetButton>
        )}
      </GroupHeader>
      <p style={{ marginTop: 0, color: tokens.colors.text.secondary }}>
        {description}
      </p>
      {children}
    </>
  );

  return isSection ? (
    content
  ) : (
    <Subsection $isEmpty={isEmpty}>{content}</Subsection>
  );
};

export default Group;
