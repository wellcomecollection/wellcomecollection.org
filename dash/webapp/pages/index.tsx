import { FunctionComponent, useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Issue from '../components/Issue';
import { getPrismicLintingReport } from './prismic-linting';

const fontFamily = 'Gadget, sans-serif';

const IndexPage: FunctionComponent = () => {
  const [prismicLintResults, setPrismicLintResults] = useState<{
    totalErrors: number;
  } | null>(null);

  useEffect(() => {
    getPrismicLintingReport().then(json => setPrismicLintResults(json));
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div style={{ fontFamily }}>
        <Header title="Dashboard" />
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1>Wellcome Collection</h1>
          <ul>
            <li>
              <a href="https://wellcomecollection.org" rel="website">
                Wellcome Collection website
              </a>
            </li>
            <li>
              <a
                href="https://github.com/wellcomecollection/wellcomecollection.org"
                rel="repo"
              >
                wc.org Github repo
              </a>
            </li>
            <li>
              <a
                href="https://github.com/wellcomecollection/platform"
                rel="repo"
              >
                Platform GitHub repo
              </a>
            </li>
            <li>
              <a
                href="https://cardigan.wellcomecollection.org"
                rel="design-system"
              >
                Cardigan, our design system
              </a>
            </li>
            <li>
              <a
                href="https://developers.wellcomecollection.org"
                rel="developers-site"
              >
                Developers site
              </a>
            </li>
            <li>
              <a href="https://stacks.wellcomecollection.org/" rel="blog">
                Stacks, our blog
              </a>
            </li>
          </ul>

          {prismicLintResults && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ paddingRight: '1em' }}>
                {prismicLintResults.totalErrors === 0 && (
                  <Issue $type="success">0 issues</Issue>
                )}
                {prismicLintResults.totalErrors > 0 && (
                  <Issue $type="error">
                    {prismicLintResults.totalErrors} issue
                    {prismicLintResults.totalErrors > 1 ? 's' : ''}
                  </Issue>
                )}
              </div>
              <a href="/prismic-linting">Prismic linting report</a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default IndexPage;
