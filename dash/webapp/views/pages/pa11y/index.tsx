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
  // tag outside one, and the label it groups warnings by. Missing from older
  // reports.
  component?: string | null;
  groupLabel?: string;
};

type Pa11yResult = {
  documentTitle: string;
  pageUrl: string;
  issues: IssueType[];
};

type Pa11yReport = {
  results: Pa11yResult[];
  timestamp?: string;
};

// Groups items by key, keeping the order each key first appears in
function groupBy<T>(
  items: T[],
  keyOf: (item: T) => string
): { key: string; items: T[] }[] {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const key = keyOf(item);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  return [...groups].map(([key, items]) => ({ key, items }));
}

// Older reports don't have groupLabel, so work it out the same way the script
// does
const warningGroupLabel = (warning: IssueType) =>
  warning.groupLabel ??
  `${warning.code} in ${warning.component ?? '(unknown)'}`;

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
  const pagesWithIssues = results.filter(({ score }) => score > 0);
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

          {pagesWithIssues.length > 0 && (
            <>
              {pagesWithIssues.map(
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

                      {groupBy(
                        issues.filter(({ type }) => type !== 'warning'),
                        ({ type, message, selector }) =>
                          `${type}-${message}-${selector}`
                      ).map(({ key, items: issues }) => {
                        const group = issues[0];
                        return (
                          <Issue $type={group.type} key={key}>
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

                      {groupBy(warnings, warningGroupLabel)
                        // Warnings mostly repeat a few patterns, so show the
                        // biggest groups first
                        .sort((a, b) => b.items.length - a.items.length)
                        .map(({ key: label, items: issues }) => (
                          <Issue $type="warning" key={label}>
                            <details>
                              <WarningSummary>
                                warning: {label} (&times; {issues.length})
                              </WarningSummary>
                              <p>{issues[0].message}</p>
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
                        ))}
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
