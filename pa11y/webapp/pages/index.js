import {default as React, Fragment} from 'react';
import fetch from 'isomorphic-unfetch';
const dev = process.env.NODE_ENV !== 'production';

const Index = ({resultsList}: any) => {
  return (
    <Fragment>
      <header>
        <h1>Pa11y</h1>
      </header>
      <main>
        {resultsList.results.map(({documentTitle, pageUrl, issues}) => {
          const errorCount = issues.filter(issue => issue.type === 'error').length;
          const warningCount = issues.filter(issue => issue.type === 'warning').length;
          const noticeCount = issues.filter(issue => issue.type === 'notice').length;
          return (
            <section key={pageUrl}>
              <h2>{documentTitle}</h2>
              <h3>{pageUrl}</h3>
              <div style={{
                display: 'flex'
              }}>
                <div className='issue error'>{errorCount}</div>
                <div className='issue warning'>{warningCount}</div>
                <div className='issue notice'>{noticeCount}</div>
              </div>
              {issues.map(issue => {
                return (
                  <div key={issue.selector} className={`issue ${issue.type}`}>
                    <p><b>{issue.type}: {issue.message}</b></p>

                    <div>Context</div>
                    <pre>{issue.context}</pre>

                    <div style={{
                      marginTop: '12px'
                    }}>Selector</div>
                    <pre>{issue.selector}</pre>
                  </div>
                );
              })}
            </section>
          );
        })}
      </main>
      <style jsx>{`
        header, main {
          width: 800px;
          margin: 0 auto;
        }
        section {
          margin-top: 18px;
          padding: 6px 0;
          border-top: 1px solid #d9d6ce;
        }
        pre {
          overflow: auto;
          background: #e8e8e8;
          margin: 6px 0;
        }
        h2 {
          margin-bottom: 6px;
        }
        h3 {
          font-weight: normal;
          color: #717171;
          font-size: 14px;
          margin-top: 0;
        }
        .issue {
          padding: 12px;
          margin: 6px;
        }
        .error {
          border: 1px solid rgba(224, 27, 47, 1);
          background: rgba(224, 27, 47, 0.25);
        }
        .warning {
          border: 1px solid rgba(232, 117, 0, 1);
          background: rgba(232, 117, 0, 0.25);
        }
        .notice {
          border: 1px solid rgba(92, 184, 191, 1);
          background: rgba(92, 184, 191, 0.25);
        }
    `}</style>
      <style global jsx>{`
        body {
          font-family: Helvetica, Arial, sans-serif;
          font-size: 16px;
        }
      `}</style>
    </Fragment>
  );
};

Index.getInitialProps = async () => {
  const url = dev
    ? 'http://localhost:3000/static/.dist/report.json' : 'https://dash.wellcomecollection.org/pa11y/static/.dist/report.json';
  const results = await fetch(url);
  const json = await results.json();

  return {resultsList: json};
};

export default Index;
