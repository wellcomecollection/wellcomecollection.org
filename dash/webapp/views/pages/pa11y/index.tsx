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

import { Description, OriginalPageLink, Pre } from './pa11y.styles';

type ErrorState = { failed: true; message: string };

type IssueType = {
  type: 'error' | 'warning' | 'notice' | 'success';
  message: string;
  selector: string;
  context: string;
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
          <PageHeader>
            <PageTitle>Pa11y Accessibility Report</PageTitle>
          </PageHeader>
          <main id="main-content">
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
    .sort((a, b) => b.score - a.score);

  const successes = results.filter(({ score }) => score === 0);
  const failures = results.filter(({ score }) => score > 0);

  return (
    <>
      <Head>
        <title>Pa11y dashboard</title>
      </Head>
      <Header activePath="/pa11y" />
      <PageContainer>
        <PageHeader>
          <PageTitle>Pa11y Accessibility Report</PageTitle>
          <PageDescription>
            Automated accessibility testing results across the website.
          </PageDescription>
        </PageHeader>

        <main id="main-content">
          <div role="status" aria-live="polite">
            <SectionHeading>Detected issues</SectionHeading>
            {failures.length > 0 ? (
              <Issue $type="error">
                {pluralise(failures.length, 'page')} with issues
              </Issue>
            ) : (
              <Issue $type="success">All pages pass accessibility checks</Issue>
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
                        <div role="status">
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

                      {groupIssues(issues).map(({ group, issues }) => {
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
