import React, { useState, useEffect, FunctionComponent } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from '../components/Header';

const fontFamily = 'Gadget, sans-serif';
const Issue = styled.div<{ type: string }>`
  padding: 12px;
  margin: 12px 0px;
  ${props =>
    props.type === 'error'
      ? `
      border: 1px solid rgba(224, 27, 47, 1);
      background: rgba(224, 27, 47, 0.25);
    `
      : ''}

  // This is the validation green from the global palette
  ${props =>
    props.type === 'success'
      ? `
          border: 1px solid rgba(11, 112, 81, 1);
          background: rgba(11, 112, 81, 0.1);
        `
      : ''}
`;

const Index: FunctionComponent = () => {
  const [resultsList, setResultsList] = useState(null);

  useEffect(() => {
    fetch('https://dash.wellcomecollection.org/prismic-linting/report.json?t=1')
      .then(resp => resp.json())
      .then(json => setResultsList(json));
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
                <Issue type="success">no linting issues detected</Issue>
              )}

              {resultsList.totalErrors > 0 && (
                <Issue type="error">
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
                      {e.title[0].text} ({e.type} {e.id})
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
                created at {resultsList.createdDate}
              </p>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
