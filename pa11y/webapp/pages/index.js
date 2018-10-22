import {default as React, Fragment} from 'react';
import fetch from 'isomorphic-unfetch';
const dev = process.env.NODE_ENV !== 'production';

const Index = ({resultsList}) => {
  return (
    <Fragment>
      <h1>Pa11y</h1>
      {resultsList.results.map(({documentTitle, pageUrl, issues}) => {
        // const errorCount = issues.filter(issue => issue.type === 'error').length;
        // const warningCount = issues.filter(issue => issue.type === 'warning').length;
        // const noticeCount = issues.filter(issue => issue.type === 'notice').length;
        return (
          <Fragment key={pageUrl}>
            <h2>{documentTitle}</h2>
            <h3>{pageUrl}</h3>
            {issues.map(issue => {
              return (
                <Fragment key={issue.selector}>
                  <p>{issue.message}</p>

                  <p>Context</p>
                  <pre>{issue.context}</pre>

                  <p>Selector</p>
                  <pre>{issue.selector}</pre>
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
    </Fragment>
  );
};

Index.getInitialProps = async () => {
  const url = dev  ? 'http://localhost:3000/static/.dist/report.json' : 'https://dash.wellcomecollection.org/pa11y/json/report.latest.json';
  const results = await fetch(url);
  const json = await results.json();

  return {resultsList: json};
};

export default Index;
