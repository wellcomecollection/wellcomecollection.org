import { Fragment, useState, useEffect, FunctionComponent } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';

const fontFamily = 'Gadget, sans-serif';
const Pre = styled.pre`
  overflow: auto;
  background: #e8e8e8;
  margin: 6px 0;
`;
const Issue = styled.div`
  padding: 12px;
  margin: 6px;
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
`;

const Index: FunctionComponent = () => {
  const [resultsList, setResultsList] = useState(null);

  useEffect(() => {
    fetch('https://dash.wellcomecollection.org/pa11y/report.json')
      .then(resp => resp.json())
      .then(json => setResultsList(json));
  }, []);

  return (
    resultsList && (
      <Fragment>
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
              {resultsList.results.map(({ documentTitle, pageUrl, issues }) => {
                const errorCount = issues.filter(
                  issue => issue.type === 'error'
                ).length;
                const warningCount = issues.filter(
                  issue => issue.type === 'warning'
                ).length;
                const noticeCount = issues.filter(
                  issue => issue.type === 'notice'
                ).length;
                return (
                  <section
                    key={pageUrl}
                    style={{
                      marginTop: '18px',
                      padding: '6px 0',
                      borderTop: '1px solid #d9d6ce',
                    }}
                  >
                    <h2
                      style={{
                        marginBottom: '6px',
                      }}
                    >
                      {documentTitle}
                    </h2>
                    <h3
                      style={{
                        fontWeight: 'normal',
                        color: '#717171',
                        fontSize: '14px',
                        marginTop: 0,
                      }}
                    >
                      {pageUrl}
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                      }}
                    >
                      <Issue type="error">{errorCount}</Issue>
                      <Issue type="warning">{warningCount}</Issue>
                      <Issue type="notice">{noticeCount}</Issue>
                    </div>
                    {issues.map(issue => {
                      return (
                        <Issue type={issue.type} key={issue.selector}>
                          <p>
                            <b>
                              {issue.type}: {issue.message}
                            </b>
                          </p>

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
              })}
            </main>
          </div>
        </div>
      </Fragment>
    )
  );
};

export default Index;
