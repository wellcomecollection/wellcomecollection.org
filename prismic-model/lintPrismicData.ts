/** This script runs some linting rules against a snapshot of Prismic.
 *
 * It's meant to help us find issues in the data that need to be fixed in
 * Prismic.  Unfortunately Prismic itself doesn't allow us to configure
 * this linting directly in the CMS, so we have to run it against a snapshot.
 *
 * See https://prismic.io/blog/required-fields
 */

import chalk from 'chalk';
import exp from 'constants';
import { error } from './console';
import {
  downloadPrismicSnapshot,
  getPrismicDocuments,
} from './downloadSnapshot';

// Look for eur01 safelinks.  These occur when somebody has copied
// a URL directly from Outlook and isn't using the original URL.
//
// This is a very crude check; we could recurse further down into
// the object to get more debugging information, but I hope this
// is good enough for now.
function detectEur01Safelinks(doc: any): string[] {
  if (
    JSON.stringify(doc).indexOf(
      'https://eur01.safelinks.protection.outlook.com'
    ) !== -1
  ) {
    return ['- eur01 safelinks URL detected!'];
  }

  return [];
}

// Look for broken links to interpretation types on events.
//
// These manifest as small black squares (on promo cards) or small yellow
// squares (on the event pages).
//
// See e.g. https://wellcome.slack.com/archives/C8X9YKM5X/p1662107045936069
function detectBrokenInterpretationTypeLinks(doc: any): string[] {
  if (doc.type === 'events') {
    const brokenLinks = doc.data.interpretations.filter(
      it => it.interpretationType.type === 'broken_type'
    );

    if (brokenLinks.length > 0) {
      return ['- link to an interpretation type is broken'];
    }
  }

  return [];
}

// Contributor links that don't begin with http or https will be treated as
// relative URLs on the front-end, e.g. www.example.com becomes wc.org/articles/www.example.com.
//
// This obviously isn't what we want; this will find any cases where the link
// doesn't have an http[s] prefix.
function detectNonHttpContributorLinks(doc: any): string[] {
  if (doc.type === 'people' || doc.type === 'organisations') {
    for (const sameAs of doc.data.sameAs) {
      const { link } = sameAs;

      if (
        link === null ||
        link.indexOf('http://') === 0 ||
        link.indexOf('https://') === 0
      ) {
        continue;
      }

      return ['- non-HTTP link in contributor link'];
    }
  }

  return [];
}

async function run() {
  const snapshotDir = await downloadPrismicSnapshot();

  let totalErrors = 0;

  for (const doc of getPrismicDocuments(snapshotDir)) {
    const errors = [
      ...detectEur01Safelinks(doc),
      ...detectBrokenInterpretationTypeLinks(doc),
      ...detectNonHttpContributorLinks(doc),
    ];

    totalErrors += errors.length;

    // If there are any errors, report them to the console.
    if (errors.length > 0) {
      console.log(
        chalk.blue(
          `https://wellcomecollection.prismic.io/documents~b=working&c=published&l=en-gb/${doc.id}/`
        )
      );
      for (const msg of errors) {
        console.log(msg);
      }
      console.log('');
    }
  }

  if (totalErrors === 0) {
    console.log(chalk.green('✅ No errors detected'));
  } else {
    console.log(
      chalk.red(`🚨 ${totalErrors} error${totalErrors > 1 ? 's' : ''} detected`)
    );
    process.exit(1);
  }
}

run().catch(err => {
  error(err);
  process.exit(1);
});
