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
  PageTitle,
  ReportDetails,
  ReportFooter,
  ReportSummary,
  SectionHeading,
} from '@weco/dash/views/components/PageLayout';
import { tokens } from '@weco/dash/views/themes/tokens';

type CheckDescription = {
  name: string;
  description: string;
};

type ReportData = {
  checks?: CheckDescription[];
  totalErrors: number;
  errors: ErrorProps[];
  ref: string;
  createdDate: string;
};

type ErrorState = { failed: true; message: string };

export function getPrismicLintingReport(): Promise<ReportData> {
  const reportUrl =
    'https://dash.wellcomecollection.org/prismic-linting/report.json';

  return fetch(reportUrl).then(resp => {
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  });
}

type ErrorProps = {
  id: string;
  type: string;
  title: { text: string }[];
  errors: string[];
};

const PrismicLintingPage: FunctionComponent = () => {
  const [resultsList, setResultsList] = useState<
    ReportData | ErrorState | null
  >(null);

  useEffect(() => {
    getPrismicLintingReport()
      .then(json => setResultsList(json))
      .catch(() =>
        setResultsList({
          failed: true,
          message: 'Failed to load Prismic linting report.',
        })
      );
  }, []);

  if (!resultsList) return null;

  if ('failed' in resultsList) {
    return (
      <>
        <Head>
          <title>Prismic linting dashboard</title>
        </Head>
        <Header activePath="/prismic-linting" />
        <PageContainer>
          <PageHeader>
            <PageTitle>Prismic Content Linting</PageTitle>
          </PageHeader>
          <main id="main-content">
            <Issue $type="error">{resultsList.message}</Issue>
          </main>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Prismic linting dashboard</title>
      </Head>
      <Header activePath="/prismic-linting" />
      <PageContainer>
        <PageHeader>
          <PageTitle>Prismic Content Linting</PageTitle>
          <PageDescription>
            Content quality checks for Prismic CMS entries.
          </PageDescription>
        </PageHeader>

        <main id="main-content">
          <SectionHeading>Detected issues</SectionHeading>

          <div role="status" aria-live="polite">
            {resultsList.totalErrors === 0 && (
              <Issue $type="success">No linting issues detected</Issue>
            )}

            {resultsList.totalErrors > 0 && (
              <Issue $type="error">
                {pluralise(resultsList.totalErrors, 'linting issue')} detected
              </Issue>
            )}
          </div>

          {resultsList.errors.length > 0 &&
            resultsList.errors.map(e => (
              <section key={e.id}>
                <h3>
                  <a
                    href={`https://wellcomecollection.prismic.io/builder/pages/${encodeURIComponent(e.id)}`}
                  >
                    {e.title && e.title.length > 0 ? (
                      <>
                        {e.title[0].text} ({e.type} {e.id})
                      </>
                    ) : (
                      <>
                        {e.type} {e.id}
                      </>
                    )}
                  </a>
                </h3>
                <ul>
                  {e.errors.map(message => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </section>
            ))}

          {resultsList.checks && resultsList.checks.length > 0 && (
            <ReportDetails
              aria-label={`${pluralise(resultsList.checks.length, 'check')} we run`}
            >
              <ReportSummary>
                What we check for ({resultsList.checks.length} checks)
              </ReportSummary>
              <ul
                style={{
                  lineHeight: '1.8',
                  color: tokens.colors.text.secondary,
                  marginTop: tokens.spacing.md,
                }}
              >
                {resultsList.checks.map(check => (
                  <li key={check.name}>
                    <strong>{check.name}</strong> – {check.description}
                  </li>
                ))}
              </ul>
            </ReportDetails>
          )}

          <ReportFooter>
            <p>
              Report created{' '}
              {getHumanFriendlyDateString(resultsList.createdDate)}
            </p>
          </ReportFooter>
        </main>
      </PageContainer>
    </>
  );
};

export default PrismicLintingPage;
