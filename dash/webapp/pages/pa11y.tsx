import React, { useState, useEffect, FC } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from '../components/Header';

const fontFamily = 'Gadget, sans-serif';
const Pre = styled.pre`
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */

  // This is the neutral.300 from the global palette
  background: #e8e8e8;

  margin: 6px 0;
  padding: 6px;
`;
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
  ${props =>
    props.type === 'warning'
      ? `
      border: 1px solid rgba(232, 117, 0, 1);
      background: rgba(232, 117, 0, 0.25);
    `
      : ''}
  ${props =>
    props.type === 'notice'
      ? `
      border: 1px solid rgba(92, 184, 191, 1);
      background: rgba(92, 184, 191, 0.25);
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

const OriginalPageLink = styled.a`
  color: #121212;

  :hover {
    text-decoration: none;
  }
`;

const Description = styled.p`
  margin-top: 0;
  font-weight: bold;
`;

const Index: FC = () => {
  const [resultsList, setResultsList] = useState([]);

  useEffect(() => {
    fetch('https://dash.wellcomecollection.org/pa11y/report.json')
      .then(resp => resp.json())
      .then(json => setResultsList(json));
  }, []);

  // This "score" is used to order the results, to make it easier to
  // spot failures in the dashboard -- pages with lots of errors will
  // appear at the top of the page.
  const results = (resultsList['results'] || [])
    .map(r => {
      const errors = r.issues.filter(({ type }) => type === 'error');
      const warnings = r.issues.filter(({ type }) => type === 'warning');
      const notices = r.issues.filter(({ type }) => type === 'notice');

      const score = 100 * errors.length + 10 * warnings.length + notices.length;

      return { ...r, score, errors, warnings, notices };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <>
      <Head>
        <title>Pa11y dashboard</title>
      </Head>
      {resultsList && (
        <div
          style={{
            fontFamily,
          }}
        >
          <Header title="Pa11y" />
          <div
            style={{
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <main>
              {results.map(
                ({
                  documentTitle,
                  pageUrl,
                  issues,
                  errors,
                  warnings,
                  notices,
                }) => {
                  return (
                    <section
                      key={pageUrl}
                      style={{
                        marginTop: '18px',
                        padding: '6px 0',
                        borderTop: '1px solid #d9d6ce',
                      }}
                    >
                      <OriginalPageLink href={pageUrl}>
                        <h3
                          style={{
                            marginBottom: '6px',
                          }}
                        >
                          {documentTitle}
                        </h3>
                      </OriginalPageLink>
                      <div
                        style={{
                          display: 'flex',
                        }}
                      >
                        {issues.length === 0 ? (
                          <Issue type="success">No issues reported</Issue>
                        ) : (
                          issues.length > 1 && (
                            <>
                              {errors.length > 0 && (
                                <Issue type="error">
                                  {errors.length} error
                                  {errors.length !== 1 ? 's' : ''}
                                </Issue>
                              )}
                              {warnings.length > 0 && (
                                <Issue type="error">
                                  {warnings.length} warning
                                  {warnings.length !== 1 ? 's' : ''}
                                </Issue>
                              )}
                              {notices.length > 0 && (
                                <Issue type="error">
                                  {notices.length} notice
                                  {notices.length !== 1 ? 's' : ''}
                                </Issue>
                              )}
                            </>
                          )
                        )}
                      </div>

                      {issues.map(issue => {
                        return (
                          <Issue type={issue.type} key={issue.selector}>
                            <Description>
                              {issue.type}: {issue.message}
                            </Description>

                            <div>Context</div>
                            <Pre>{issue.context}</Pre>

                            <div
                              style={{
                                marginTop: '12px',
                              }}
                            >
                              Selector
                            </div>
                            <Pre>{issue.selector}</Pre>
                          </Issue>
                        );
                      })}
                    </section>
                  );
                }
              )}
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
