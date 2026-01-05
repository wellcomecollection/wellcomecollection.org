import Head from 'next/head';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import Header from '../components/Header';
import Issue from '../components/Issue';

const fontFamily = 'Gadget, sans-serif';
const Pre = styled.pre`
  white-space: pre-wrap; /* css-3 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */

  /* This is the neutral.300 from the global palette */
  background: #e8e8e8;

  margin: 6px 0;
  padding: 6px;
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

type IssueGroup = {
  type: string;
  message: string;
  selector: string;
};

type IssueType = IssueGroup & {
  context: string;
};

function groupIssues(
  issues: IssueType[]
): { group: IssueGroup; issues: IssueType[] }[] {
  const result: { group: IssueGroup; issues: IssueType[] }[] = [];

  for (const i of issues) {
    const matchingGroup = result
      .filter(
        r =>
          r.group.type === i.type &&
          r.group.message === i.message &&
          r.group.selector === i.selector
      )
      .find(_ => _);

    if (typeof matchingGroup !== 'undefined') {
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

const Index: FunctionComponent = () => {
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

  const successes = results.filter(({ score }) => score === 0);
  const failures = results.filter(({ score }) => score > 0);

  return (
    <>
      <Head>
        <title>Pa11y dashboard</title>
      </Head>
      {resultsList && (
        <div style={{ fontFamily }}>
          <Header title="Pa11y" />
          <div
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.3em',
            }}
          >
            <main>
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
                          {documentTitle.replace('| Wellcome Collection', '')}
                        </h3>
                      </OriginalPageLink>
                      {issues.length > 1 && (
                        <>
                          {errors.length > 0 && (
                            <Issue $type="error">
                              {errors.length} error
                              {errors.length !== 1 ? 's' : ''}
                            </Issue>
                          )}
                          {warnings.length > 0 && (
                            <Issue $type="error">
                              {warnings.length} warning
                              {warnings.length !== 1 ? 's' : ''}
                            </Issue>
                          )}
                          {notices.length > 0 && (
                            <Issue $type="error">
                              {notices.length} notice
                              {notices.length !== 1 ? 's' : ''}
                            </Issue>
                          )}
                        </>
                      )}

                      {groupIssues(issues).map(({ group, issues }) => {
                        return (
                          <Issue
                            $type={group.type}
                            key={`${group.type}-${group.message}`}
                          >
                            <Description>
                              {group.type}: {group.message}
                              {issues.length > 1 ? (
                                <> (&times; {issues.length})</>
                              ) : (
                                ''
                              )}
                            </Description>

                            <div>Context{issues.length > 1 ? 's' : ''}</div>

                            {issues.map(issue => (
                              <Pre key={issue.context}>{issue.context}</Pre>
                            ))}

                            <div
                              style={{
                                marginTop: '12px',
                              }}
                            >
                              Selector
                            </div>
                            <Pre>{group.selector}</Pre>
                          </Issue>
                        );
                      })}
                    </section>
                  );
                }
              )}

              {successes.length > 0 && (
                <section
                  key="successes"
                  style={{
                    marginTop: '18px',
                    padding: '6px 0',
                    borderTop: '1px solid #d9d6ce',
                  }}
                >
                  <Issue $type="success">
                    No issues reported on the following pages.
                  </Issue>

                  <ul>
                    {successes.map(({ pageUrl, documentTitle }) => (
                      <li key={pageUrl}>
                        <OriginalPageLink href={pageUrl}>
                          {documentTitle.replace('| Wellcome Collection', '')}
                        </OriginalPageLink>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
