const { URL } = require('url');

const issuesOfType = (result, type) =>
  result.issues.filter(issue => issue.type === type);

const countOfType = (results, type) =>
  results.flatMap(result => issuesOfType(result, type)).length;

// The pages with issues of the given type, listing each issue
const issuesLog = (results, type) =>
  results
    .map(result => ({
      title: result.documentTitle,
      url: result.pageUrl,
      issues: issuesOfType(result, type).map(issue => ({
        code: issue.code,
        message: issue.message,
        selector: issue.selector,
        context: issue.context,
      })),
    }))
    .filter(page => page.issues.length > 0);

// One line per rule and component, with a count and the pages it's on
const warningsSummary = results => {
  const groups = new Map();

  results.forEach(result => {
    const path = result.pageUrl ? new URL(result.pageUrl).pathname : '?';

    issuesOfType(result, 'warning').forEach(issue => {
      const group = groups.get(issue.groupLabel) ?? {
        count: 0,
        pages: new Set(),
      };
      group.count += 1;
      group.pages.add(path);
      groups.set(issue.groupLabel, group);
    });
  });

  return [...groups]
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([key, { count, pages }]) => {
      const pageList = [...pages];
      const shown = pageList.slice(0, 3).join(', ');
      const more = pageList.length > 3 ? `, +${pageList.length - 3} more` : '';
      return `  ${count} x ${key} (${shown}${more})`;
    })
    .join('\n');
};

/**
 * The pages that didn't load, paired with the URL that was asked for.
 *
 * Valid Wellcome Collection pages contain "Wellcome Collection" in the title.
 * Error pages (429, 403, 503, etc.) from CloudFront return
 * "wellcomecollection.org" (lowercase), so the check is case-sensitive.
 *
 * Takes the URLs as well because results are in the order they were asked for,
 * and a page that failed outright has no pageUrl of its own.
 */
const pagesThatFailedToLoad = (results, urls) =>
  results
    .map((result, i) => ({ result, url: urls[i] }))
    .filter(
      ({ result }) =>
        !result.documentTitle ||
        !result.pageUrl ||
        !result.documentTitle.includes('Wellcome Collection')
    );

module.exports = {
  issuesOfType,
  countOfType,
  issuesLog,
  warningsSummary,
  pagesThatFailedToLoad,
};
