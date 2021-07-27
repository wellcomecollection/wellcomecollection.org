import { markdownTable } from 'markdown-table';
import * as core from '@actions/core';

const getPath = (fullUrl) => (new URL(fullUrl)).pathname

try {
  const manifestJson = core.getInput('lhci_manifest')
  const manifests = JSON.parse(manifestJson)

  const table = markdownTable([
    ['Path', 'Performance', 'Accessibility', 'Best Practices', 'SEO'],
    ...manifests.map(({ url, summary }) => ([
      getPath(url), summary.performance, summary.accessibility, summary['best-practices'], summary.seo
    ]))
  ]);

  core.setOutput('table', table)
} catch (error) {
  core.setFailed(error.message);
}
