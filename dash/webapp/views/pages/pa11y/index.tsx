import Head from 'next/head';
import { FunctionComponent, useEffect, useState } from 'react';

import {
  getHumanFriendlyDateString,
  pluralise,
} from '@weco/dash/utils/formatting';
import Header from '@weco/dash/views/components/Header';
import Issue from '@weco/dash/views/components/Issue';
import {
  PageContainer,
  PageDescription,
  PageHeader,
  PageSubheading,
  PageTitle,
  ReportDetails,
  ReportFooter,
  ReportSection,
  ReportSummary,
  SectionHeading,
} from '@weco/dash/views/components/PageLayout';
import { tokens } from '@weco/dash/views/themes/tokens';

import {
  Description,
  OriginalPageLink,
  Pre,
  SelectorLabel,
  WarningSummary,
} from './pa11y.styles';

type ErrorState = { failed: true; message: string };

type IssueType = {
  type: 'error' | 'warning' | 'notice' | 'success';
  code?: string;
  message: string;
  selector: string;
  context: string;
  // Added by our pa11y script: the nearest data-component, or the element's
  // tag outside one. Missing from older reports.
  component?: string | null;
};

type IssueGroup = Pick<IssueType, 'type' | 'message' | 'selector'>;

type Pa11yResult = {
  documentTitle: string;
  pageUrl: string;
  issues: IssueType[];
};

type Pa11yReport = {
  results: Pa11yResult[];
  timestamp?: string;
};

function groupIssues(
  issues: IssueType[]
): { group: IssueGroup; issues: IssueType[] }[] {
  const result: { group: IssueGroup; issues: IssueType[] }[] = [];

  for (const i of issues) {
    const matchingGroup = result.find(
      r =>
        r.group.type === i.type &&
        r.group.message === i.message &&
        r.group.selector === i.selector
    );

    if (matchingGroup) {
      matchingGroup.issues.push(i);
    } else {
      result.push({
        group: { type: i.type, message: i.message, selector: i.selector },
        issues: [i],
      });
    }
  }

  return result;
}

// Warnings mostly repeat the same few patterns, so group them by rule and
// component rather than by element
function groupWarnings(
  warnings: IssueType[]
): { label: string; message: string; issues: IssueType[] }[] {
  const groups = new Map<string, { message: string; issues: IssueType[] }>();

  for (const warning of warnings) {
    const label = `${warning.code ?? 'warning'} in ${warning.component ?? '(unknown)'}`;
    const group = groups.get(label) ?? { message: warning.message, issues: [] };
    group.issues.push(warning);
    groups.set(label, group);
  }

  return [...groups]
    .map(([label, group]) => ({ label, ...group }))
    .sort((a, b) => b.issues.length - a.issues.length);
}

const Pa11yPage: FunctionComponent = () => {
  const [resultsList, setResultsList] = useState<
    Pa11yReport | ErrorState | null
  >(null);

  useEffect(() => {
    fetch('https://dash.wellcomecollection.org/pa11y/report.json')
      .then(resp => {
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp.json();
      })
      .then(json => setResultsList(json))
      .catch(() =>
        setResultsList({
          failed: true,
          message: 'Failed to load Pa11y report.',
        })
      );
  }, []);

  if (!resultsList) return null;

  if ('failed' in resultsList) {
    return (
      <>
        <Head>
          <title>Pa11y dashboard</title>
        </Head>
        <Header activePath="/pa11y" />
        <PageContainer>
          <main id="main-content">
            <PageHeader>
              <PageTitle>Pa11y Accessibility Report</PageTitle>
            </PageHeader>
            <Issue $type="error">{resultsList.message}</Issue>
          </main>
        </PageContainer>
      </>
    );
  }

  const results = ((resultsList && resultsList['results']) || [])
    .map(r => {
      const errors = r.issues.filter(({ type }) => type === 'error');
      const warnings = r.issues.filter(({ type }) => type === 'warning');
      const notices = r.issues.filter(({ type }) => type === 'notice');

      const score = 100 * errors.length + 10 * warnings.length + notices.length;

      return { ...r, score, errors, warnings, notices };
    })
    // Pages with errors first, however many warnings other pages have
    .sort((a, b) => b.errors.length - a.errors.length || b.score - a.score);

  const successes = results.filter(({ score }) => score === 0);
  const failures = results.filter(({ score }) => score > 0);
  // Warnings are for checking by hand, so they don't make a page fail
  const pagesWithErrors = results.filter(({ errors }) => errors.length > 0);
  const pagesWithOnlyWarnings = results.filter(
    ({ errors, warnings }) => errors.length === 0 && warnings.length > 0
  );

  return (
    <>
      <Head>
        <title>Pa11y dashboard</title>
      </Head>
      <Header activePath="/pa11y" />
      <PageContainer>
        <main id="main-content">
          <PageHeader>
            <PageTitle>Pa11y Accessibility Report</PageTitle>
            <PageDescription>
              Automated accessibility testing results across the website.
            </PageDescription>
          </PageHeader>

          <div role="status" aria-live="polite">
            <SectionHeading>Detected issues</SectionHeading>
            {pagesWithErrors.length > 0 ? (
              <Issue $type="error">
                {pluralise(pagesWithErrors.length, 'page')} with errors
              </Issue>
            ) : (
              <Issue $type="success">All pages pass accessibility checks</Issue>
            )}
            {pagesWithOnlyWarnings.length > 0 && (
              <Issue $type="warning">
                {pluralise(pagesWithOnlyWarnings.length, 'page')} with only
                warnings to check by hand
              </Issue>
            )}
          </div>

          {failures.length > 0 && (
            <>
              {failures.map(
                ({
                  documentTitle,
                  pageUrl,
                  issues,
                  errors,
                  warnings,
                  notices,
                }) => {
                  return (
                    <ReportSection key={pageUrl}>
                      <PageSubheading>
                        <OriginalPageLink href={pageUrl}>
                          {documentTitle.replace('| Wellcome Collection', '')}
                        </OriginalPageLink>
                      </PageSubheading>
                      {issues.length > 1 && (
                        <div>
                          {errors.length > 0 && (
                            <Issue $type="error">
                              {pluralise(errors.length, 'error')}
                            </Issue>
                          )}
                          {warnings.length > 0 && (
                            <Issue $type="warning">
                              {pluralise(warnings.length, 'warning')}
                            </Issue>
                          )}
                          {notices.length > 0 && (
                            <Issue $type="notice">
                              {pluralise(notices.length, 'notice')}
                            </Issue>
                          )}
                        </div>
                      )}

                      {groupIssues(
                        issues.filter(({ type }) => type !== 'warning')
                      ).map(({ group, issues }) => {
                        return (
                          <Issue
                            $type={group.type}
                            key={`${group.type}-${group.message}-${group.selector}`}
                          >
                            <Description>
                              {group.type}: {group.message}
                              {issues.length > 1 ? (
                                <> (&times; {issues.length})</>
                              ) : (
                                ''
                              )}
                            </Description>

                            <div>{pluralise(issues.length, 'Context')}</div>

                            {issues.map((issue, i) => (
                              <Pre key={`${issue.context}-${i}`}>
                                {issue.context}
                              </Pre>
                            ))}

                            <div style={{ marginTop: tokens.spacing.sm }}>
                              Selector
                            </div>
                            <Pre>{group.selector}</Pre>
                          </Issue>
                        );
                      })}

                      {groupWarnings(warnings).map(
                        ({ label, message, issues }) => (
                          <Issue $type="warning" key={label}>
                            <details>
                              <WarningSummary>
                                warning: {label} (&times; {issues.length})
                              </WarningSummary>
                              <p>{message}</p>
                              {issues.map((issue, i) => (
                                <div key={`${issue.selector}-${i}`}>
                                  <Pre>{issue.context}</Pre>
                                  <SelectorLabel>
                                    Selector: <code>{issue.selector}</code>
                                  </SelectorLabel>
                                </div>
                              ))}
                            </details>
                          </Issue>
                        )
                      )}
                    </ReportSection>
                  );
                }
              )}
            </>
          )}

          {successes.length > 0 && (
            <ReportDetails
              aria-label={`${pluralise(successes.length, 'passing page')}`}
            >
              <ReportSummary>
                Pages we look at ({successes.length})
              </ReportSummary>

              <ul style={{ marginTop: tokens.spacing.md }}>
                {successes.map(({ pageUrl, documentTitle }) => (
                  <li key={pageUrl}>
                    <OriginalPageLink href={pageUrl}>
                      {documentTitle.replace('| Wellcome Collection', '')}
                    </OriginalPageLink>
                  </li>
                ))}
              </ul>
            </ReportDetails>
          )}

          {resultsList.timestamp && (
            <ReportFooter>
              <p>
                Report created{' '}
                {getHumanFriendlyDateString(resultsList.timestamp)}
              </p>
            </ReportFooter>
          )}
        </main>
      </PageContainer>
    </>
  );
};

export default Pa11yPage;
