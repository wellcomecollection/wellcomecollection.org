import Head from 'next/head';
import { FunctionComponent, useEffect, useState } from 'react';

import { pluralise } from '@weco/dash/utils/formatting';
import Header from '@weco/dash/views/components/Header';
import {
  PageContainer,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@weco/dash/views/components/PageLayout';
import { tokens } from '@weco/dash/views/themes/tokens';

import {
  Card,
  CardDescription,
  CardsGrid,
  CardStatus,
  CardTitle,
  LinksSection,
} from './index.styles';
import { getPrismicLintingReport } from './prismic-linting';

const Dashboard: FunctionComponent = () => {
  const [prismicLintResults, setPrismicLintResults] = useState<{
    totalErrors: number;
  } | null>(null);
  const [pa11yResults, setPa11yResults] = useState<{
    totalErrors: number;
    totalWarnings: number;
  } | null>(null);

  useEffect(() => {
    getPrismicLintingReport()
      .then(json => setPrismicLintResults(json))
      .catch(() => setPrismicLintResults(null));

    fetch('https://dash.wellcomecollection.org/pa11y/report.json')
      .then(resp => resp.json())
      .then(json => {
        const results = json.results || [];
        const totalErrors = results.reduce(
          (acc: number, r: { issues: { type: string }[] }) =>
            acc + r.issues.filter(({ type }) => type === 'error').length,
          0
        );
        const totalWarnings = results.reduce(
          (acc: number, r: { issues: { type: string }[] }) =>
            acc + r.issues.filter(({ type }) => type === 'warning').length,
          0
        );
        setPa11yResults({ totalErrors, totalWarnings });
      })
      .catch(() => setPa11yResults({ totalErrors: 0, totalWarnings: 0 }));
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Header />
      <PageContainer>
        <PageHeader>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Monitor site health, manage feature toggles, and access key tools.
          </PageDescription>
        </PageHeader>

        <main id="main-content">
          <CardsGrid role="list">
            <Card href="/toggles" role="listitem">
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>
                Manage and test feature flags across environments.
              </CardDescription>
              <CardStatus $type="neutral">View all toggles →</CardStatus>
            </Card>

            <Card href="/pa11y" role="listitem">
              <CardTitle>Pa11y Accessibility</CardTitle>
              <CardDescription>
                Automated accessibility testing results across the site.
              </CardDescription>
              {pa11yResults ? (
                pa11yResults.totalErrors === 0 ? (
                  <CardStatus $type="success">✓ No errors found</CardStatus>
                ) : (
                  <CardStatus $type="error">
                    {pluralise(pa11yResults.totalErrors, 'error')}
                    {pa11yResults.totalWarnings > 0 &&
                      `, ${pluralise(pa11yResults.totalWarnings, 'warning')}`}
                  </CardStatus>
                )
              ) : (
                <CardStatus $type="neutral" aria-live="polite">
                  Loading...
                </CardStatus>
              )}
            </Card>

            <Card href="/prismic-linting" role="listitem">
              <CardTitle>Prismic Linting</CardTitle>
              <CardDescription>
                Content quality checks for Prismic CMS entries.
              </CardDescription>
              {prismicLintResults ? (
                prismicLintResults.totalErrors === 0 ? (
                  <CardStatus $type="success">✓ No issues found</CardStatus>
                ) : (
                  <CardStatus $type="error">
                    {pluralise(prismicLintResults.totalErrors, 'issue')}
                  </CardStatus>
                )
              ) : (
                <CardStatus $type="neutral" aria-live="polite">
                  Loading...
                </CardStatus>
              )}
            </Card>
          </CardsGrid>

          <LinksSection>
            <h2 style={{ marginBottom: tokens.spacing.md }}>Quick Links</h2>
            <ul style={{ lineHeight: '1.8' }}>
              <li>
                <a href="https://wellcomecollection.org" rel="noreferrer">
                  Wellcome Collection website
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/wellcomecollection/wellcomecollection.org"
                  rel="noreferrer"
                >
                  wc.org Github repo
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/wellcomecollection/platform"
                  rel="noreferrer"
                >
                  Platform GitHub repo
                </a>
              </li>
              <li>
                <a
                  href="https://cardigan.wellcomecollection.org"
                  rel="noreferrer"
                >
                  Cardigan, our design system
                </a>
              </li>
              <li>
                <a
                  href="https://developers.wellcomecollection.org"
                  rel="noreferrer"
                >
                  Developers site
                </a>
              </li>
              <li>
                <a
                  href="https://stacks.wellcomecollection.org/"
                  rel="noreferrer"
                >
                  Stacks, our blog
                </a>
              </li>
            </ul>
          </LinksSection>
        </main>
      </PageContainer>
    </>
  );
};

export default Dashboard;
