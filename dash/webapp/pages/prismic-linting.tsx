import React, { useState, useEffect, FunctionComponent } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Issue from '../components/Issue';
import { getHumanFriendlyDateString } from '../utils/formatting';

const fontFamily = 'Gadget, sans-serif';
/* eslint-disable @typescript-eslint/no-explicit-any */
export function getPrismicLintingReport(): Promise<any> {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const reportUrl =
    'https://dash.wellcomecollection.org/prismic-linting/report.json';

  return fetch(reportUrl).then(resp => resp.json());
}

const Index: FunctionComponent = () => {
  const [resultsList, setResultsList] = useState(null);

  useEffect(() => {
    getPrismicLintingReport().then(json => setResultsList(json));
  }, []);

  return (
    <>
      <Head>
        <title>Prismic linting dashboard</title>
      </Head>
      {resultsList && (
        <div
          style={{
            fontFamily,
          }}
        >
          <Header title="Prismic linting" />
          <div
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.3em',
            }}
          >
            <main>
              {resultsList.totalErrors === 0 && (
                <Issue $type="success">no linting issues detected</Issue>
              )}

              {resultsList.totalErrors > 0 && (
                <Issue $type="error">
                  {resultsList.totalErrors} linting issue
                  {resultsList.totalErrors > 1 && 's'} detected
                </Issue>
              )}

              {resultsList.errors.map(e => (
                <>
                  <a
                    href={`https://wellcomecollection.prismic.io/documents~b=working&c=published&l=en-gb/${e.id}`}
                  >
                    <h3>
                      {e.title && e.title.length > 0 ? (
                        <>
                          {e.title[0].text} ({e.type} {e.id})
                        </>
                      ) : (
                        <>
                          {e.type} {e.id}
                        </>
                      )}
                    </h3>
                  </a>
                  <ul>
                    {e.errors.map(message => (
                      <li key={message}>{message}</li>
                    ))}
                  </ul>
                </>
              ))}

              <hr />

              <p>
                report created from {resultsList.ref}
                <br />
                created {getHumanFriendlyDateString(resultsList.createdDate)}
              </p>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
