import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

export const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${tokens.spacing.xl};
`;

export const PageHeader = styled.div`
  margin-bottom: ${tokens.spacing.xl};
`;

export const PageTitle = styled.h1`
  margin: 0 0 ${tokens.spacing.sm};
  color: ${tokens.colors.black};
  font-size: 2rem;
  font-weight: 600;
`;

export const PageDescription = styled.p`
  margin: 0;
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.fontSize.base};
  line-height: 1.6;
`;

export const ReportDetails = styled.details`
  margin-top: ${tokens.spacing.lg};
`;

export const ReportSummary = styled.summary`
  cursor: pointer;
  font-size: ${tokens.typography.fontSize.large};
  font-weight: 600;
  margin-bottom: ${tokens.spacing.md};
  user-select: none;
`;

export const ReportSection = styled.section`
  margin-top: ${tokens.spacing.md};
  padding: ${tokens.spacing.sm} 0;
  border-top: 1px solid ${tokens.colors.border.default};
`;

export const ReportFooter = styled.footer`
  margin-top: ${tokens.spacing.lg};
  border-top: 1px solid ${tokens.colors.border.default};
  padding-top: ${tokens.spacing.md};
`;

export const SectionHeading = styled.h2`
  margin-top: ${tokens.spacing.xl};
`;

export const PageSubheading = styled.h2`
  font-size: ${tokens.typography.fontSize.large};
`;
