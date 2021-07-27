import { markdownTable } from 'markdown-table';
import core from '@actions/core';

try {
  const manifestJson = core.getInput('lhci_manifest')
  const manifests = JSON.parse(manifestJson)

  const table = markdownTable([
    ['Page', 'Performance', 'Accessibility', 'Best Practices', 'SEO'],
    ...manifests.map(({ url, summary }) => ([
      url, summary.performance, summary.accessibility, summary['best-practices'], summary.seo
    ]))
  ]);

  core.setOutput('table', table)
} catch (error) {
  core.setFailed(error.message);
}
