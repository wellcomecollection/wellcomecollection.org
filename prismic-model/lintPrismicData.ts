/* eslint-disable @typescript-eslint/no-explicit-any */
/** This script runs some linting rules against a snapshot of Prismic.
 *
 * It's meant to help us find issues in the data that need to be fixed in
 * Prismic.  Unfortunately Prismic itself doesn't allow us to configure
 * this linting directly in the CMS, so we have to run it against a snapshot.
 *
 * See https://prismic.io/blog/required-fields
 */

import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import chalk from 'chalk';
import fs from 'fs';
import yargs from 'yargs';

import { pluralize } from '@weco/common/utils/grammar';

import { error } from './console';
import {
  downloadPrismicSnapshot,
  getPrismicDocuments,
} from './downloadSnapshot';

type ErrorProps = {
  id: string;
  type: string;
  title: string;
  errors: string[];
};

const { slackWebhookUrl } = yargs(process.argv.slice(2))
  .usage('Usage: $0 --slackWebhookUrl [string]')
  .options({
    slackWebhookUrl: { type: 'string' },
  })
  .parseSync();

// Look for eur01 safelinks.  These occur when somebody has copied
// a URL directly from Outlook and isn't using the original URL.
//
// This is a very crude check; we could recurse further down into
// the object to get more debugging information, but I hope this
// is good enough for now.
function detectEur01Safelinks(doc: any): string[] {
  const linkIndex = JSON.stringify(doc).indexOf(
    'https://eur01.safelinks.protection.outlook.com'
  );
  if (linkIndex !== -1) {
    const textSlice = JSON.stringify(doc).slice(
      linkIndex - 250 > 0 ? linkIndex - 250 : 0,
      linkIndex
    );

    const text = textSlice.slice(
      // "text" alone could be the parent object.
      // The comma ensure it's preced by "type": "paragraph", or something like it
      textSlice.indexOf(',"text":') + 8,
      textSlice.indexOf('spans')
    );
    return [
      `One of the links is an eur01.safelinks URL, which has probably been copy/pasted from an email. Replace this URL with an un-safelink’d version. The text around it is potentially: "${text}"`,
    ];
  }

  return [];
}

function detectNonHTTPWWWLinks(doc: any): string[] {
  const allUrlIndexes = [...JSON.stringify(doc.data).matchAll(/"url":"/gi)].map(
    a => a.index
  );

  const allErrors: string[] = [];

  if (allUrlIndexes.length > 0) {
    allUrlIndexes.forEach(urlIndex => {
      if (JSON.stringify(doc.data).indexOf('"url":"') > 0) {
        const nextCharacter = JSON.stringify(doc.data).slice(
          urlIndex + 7,
          urlIndex + 8
        );
        const next4Characters = JSON.stringify(doc.data).slice(
          urlIndex + 7,
          urlIndex + 11
        );

        if (
          nextCharacter !== '/' && // internal, hopefully
          next4Characters !== 'http' && // http, hopefully
          next4Characters !== 'mail' && // mailto, hopefully
          next4Characters !== 'tel:' // tel, hopefully
        ) {
          allErrors.push(
            'Please review the links in this document as they may not be valid. The URL should start with http[s]:// (if external) or / (if internal).'
          );
        }
      }
    });
  }
  return allErrors;
}

// Look for preview.wellcomecollection.org links.
//
// This is a very crude check; we could recurse further down into
// the object to get more debugging information, but I hope this
// is good enough for now.
function detectPreviewLinks(doc: any): string[] {
  if (
    JSON.stringify(doc).indexOf('https://preview.wellcomecollection.org/') !==
    -1
  ) {
    return [
      'One of the links is a preview.wellcomecollection.org URL, which should be replaced with a link to the live site.',
    ];
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
      return [
        'This event has a broken link to an interpretation type; remove or update the link.',
      ];
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

      return [
        'This contributor has a URL which doesn’t start with http:// or https://, replace it with a complete link',
      ];
    }
  }

  return [];
}

// Stories without a Promo image should be rare as they are considered required now
// But older articles won't necessarily have them.
//
// We'll consider a default/fallback option, but for now we want to find out which ones
// are causing issue.
function detectNonPromoImageStories(doc: any): string[] {
  if (doc.type === 'articles') {
    if (!doc.data.promo[0]) {
      return ['This article has no promo image, please add one.'];
      // getCrop won't work without square/ratioed layouts and therefore won't render an image
      // on the front end.
    } else if (!doc.data.promo[0].primary?.image?.square) {
      return [
        "This article's promo image has no square layout, re-add the image and save it to fix.",
      ];
    } else if (!doc.data.promo[0].primary?.image?.['32:15']) {
      return [
        `This article's promo image has no 32:15 layout, re-add the image and save it to fix.`,
      ];
    } else if (!doc.data.promo[0].primary?.image?.['16:9']) {
      return [
        "This article's promo image has no 16:9 layout, re-add the image and save it to fix.",
      ];
    }
  }

  return [];
}

// Digital guides video and audio have a text field to input duration.
// We'd like the style to always be xx:xx, so we're adding a test to ensure this is respected.
function detectIncorrectAudioVideoDuration(doc: any): string[] {
  const guideStopSlices =
    doc?.data?.slices?.filter(s => s.slice_type === 'guide_stop') || [];
  const regex = /^(\d{2,}:)?[0-5][0-9]:[0-5][0-9]$/; // e.g. 03:30 (optionally 01:03:30)

  const audioErrors = guideStopSlices
    .filter(
      s =>
        Boolean(s.primary.audio_duration) &&
        !s.primary.audio_duration.match(regex)
    )
    .map(
      e =>
        `The audio_duration for "${e.primary.title[0].text}" should be in the format xx:xx but it is ${e.primary.audio_duration}`
    );
  const videoErrors = guideStopSlices
    .filter(
      s =>
        Boolean(s.primary.video_duration) &&
        !s.primary.video_duration.match(regex)
    )
    .map(
      e =>
        `The video_duration for "${e.primary.title[0].text}" should be in the format xx:xx but it is ${e.primary.video_duration}`
    );

  return [...audioErrors, ...videoErrors];
}

// Contributors have a `sameAs` field which is used to generate links to
// their pages elsewhere, e.g. social media or organisation websites.
//
// These fields need to have both a link and a title specified, otherwise
// we don't show them.  Find any contributors where one is supplied but
// not the other -- in these cases, no link will appear.
function detectIncompleteContributorSameAs(doc: any): string[] {
  if (doc.type === 'people' || doc.type === 'organisations') {
    return doc.data.sameAs
      .filter(
        // Remove any instances where there's an entry but no data,
        // i.e. { link: null, title: [] }
        sameAs => !(sameAs.link === null && sameAs.title.length === 0)
      )
      .filter(
        // Remove any instances where both the link and title are populated
        // e.g. [ { link: 'http://www.blueprinttheatre.co.uk/', title: [ [Object] ] } ]
        sameAs => !(sameAs.link !== null && sameAs.title.length > 0)
      )
      .map(sameAs =>
        sameAs.link === null
          ? `The sameAs field has a title (${JSON.stringify(
              sameAs.title
            )}) but no link; add a link to make it appear`
          : `The sameAs field has a link (${sameAs.link}) but no title; add a title to make it appear`
      );
  }
  return [];
}

// Some Content Type documents should now always have a UID, but some have seemed to escape us
// so we're adding this as a safeguarding since we'll depend on them for URLs.
// We have to then get all the types that have that field, which we wanted to be a dynamic fetch
// so it didn't need a manual add every time.
const getContentTypesWithUid = () => {
  const files = fs.readdirSync('../common/customtypes/');

  return files
    .map(f => {
      const file = fs.readFileSync(
        `../common/customtypes/${f}/index.json`,
        'utf8'
      );

      let label;
      if (file) {
        const fileObject = JSON.parse(file);
        const firstChildJsonSection = Object.values(fileObject.json)?.[0] as
          | { uid?: string }
          | undefined;

        if (firstChildJsonSection && 'uid' in firstChildJsonSection)
          label = fileObject.id;
      }
      return label;
    })
    .filter(f => f);
};

// No document with the UID field should be saveable without that field filled in.
// We've had a few instances of it though, maybe they were drafts? So we're adding a test for the future.
const contentTypesWithUid = getContentTypesWithUid();
function detectMissingUidDocuments(doc: any): string[] {
  return contentTypesWithUid.includes(doc.type) && !doc.uid
    ? [`Document ${doc.id} (${doc.type}) is missing a UID, please go add one.`]
    : [];
}

// For documents with showOnThisPage enabled (which creates the "On this page" navigation),
// any slice containing an h2 in a multi-element field should have the h2 as the first element.
// This applies to text slices (primary.text), audioPlayer slices (primary.transcript),
// and embed slices (primary.transcript).
// This ensures the anchor links work correctly and the page structure is consistent.
function detectMisplacedH2InTextSlices(doc: any): string[] {
  const docTypesWithShowOnThisPage = ['pages', 'visual-stories', 'guides'];

  if (!docTypesWithShowOnThisPage.includes(doc.type)) {
    return [];
  }

  // Only check if showOnThisPage is enabled
  if (!doc.data.showOnThisPage) {
    return [];
  }

  const errors: string[] = [];
  const bodySlices = doc.data.body || doc.data.slices || [];

  // Check text slices (primary.text field)
  const textSlices = bodySlices.filter(
    (slice: any) => slice.slice_type === 'text'
  );

  for (const slice of textSlices) {
    const text = slice.primary?.text;
    if (!text || text.length === 0) {
      continue;
    }

    const sliceErrors = checkH2Placement(text, 'text slice');
    errors.push(...sliceErrors);
  }

  // Check audioPlayer slices (primary.transcript field)
  const audioPlayerSlices = bodySlices.filter(
    (slice: any) => slice.slice_type === 'audioPlayer'
  );

  for (const slice of audioPlayerSlices) {
    const transcript = slice.primary?.transcript;
    if (!transcript || transcript.length === 0) {
      continue;
    }

    const sliceErrors = checkH2Placement(
      transcript,
      'audioPlayer slice transcript'
    );
    errors.push(...sliceErrors);
  }

  // Check embed slices (primary.transcript field)
  const embedSlices = bodySlices.filter(
    (slice: any) => slice.slice_type === 'embed'
  );

  for (const slice of embedSlices) {
    const transcript = slice.primary?.transcript;
    if (!transcript || transcript.length === 0) {
      continue;
    }

    const sliceErrors = checkH2Placement(transcript, 'embed slice transcript');
    errors.push(...sliceErrors);
  }

  return errors;
}

// Helper function to check h2 placement in a multi-element field
function checkH2Placement(elements: any[], sliceContext: string): string[] {
  const errors: string[] = [];

  // Find all h2 headings in this field
  const h2Indices = elements
    .map((node: any, index: number) => (node.type === 'heading2' ? index : -1))
    .filter((index: number) => index !== -1);

  if (h2Indices.length === 0) {
    return errors;
  }

  // Check if the first element is an h2
  if (h2Indices[0] !== 0) {
    errors.push(
      `A ${sliceContext} contains an h2 heading, but it's not the first element in the slice. When "Show 'On this page' anchor links" is enabled, h2 headings must be the first element in their slice for the navigation to work correctly.`
    );
    return errors;
  }

  // Check if there are multiple h2s in the same slice
  if (h2Indices.length > 1) {
    const h2Titles = h2Indices
      .map((index: number) => elements[index].text || '[untitled]')
      .join('", "');
    errors.push(
      `A ${sliceContext} contains multiple h2 headings ("${h2Titles}"). When "Show 'On this page' anchor links" is enabled, each h2 should be in its own slice so the navigation works correctly. Please split this into separate slices.`
    );
  }

  return errors;
}

async function run() {
  const snapshotFile = await downloadPrismicSnapshot();

  let totalErrors = 0;
  const allErrors: ErrorProps[] = [];

  for (const doc of getPrismicDocuments(snapshotFile)) {
    const errors = [
      ...detectEur01Safelinks(doc),
      ...detectNonHTTPWWWLinks(doc),
      ...detectPreviewLinks(doc),
      ...detectBrokenInterpretationTypeLinks(doc),
      ...detectNonHttpContributorLinks(doc),
      ...detectNonPromoImageStories(doc),
      ...detectIncompleteContributorSameAs(doc),
      ...detectMissingUidDocuments(doc),
      ...detectIncorrectAudioVideoDuration(doc),
      ...detectMisplacedH2InTextSlices(doc),
    ];

    totalErrors += errors.length;

    // If there are any errors, report them to the console.
    if (errors.length > 0) {
      allErrors.push({
        id: doc.id,
        type: doc.type,
        title: doc.data.title,
        errors,
      });

      console.log(
        chalk.blue(
          `https://wellcomecollection.prismic.io/builder/pages/${doc.id}`
        )
      );
      for (const msg of errors) {
        console.log(`- ${msg}`);
      }
      console.log('');

      // Send an alert to Editors if anything is found on a GitHub Action run
      // https://github.com/wellcomecollection/wellcomecollection.org/actions/workflows/prismic-linting.yml
      if (slackWebhookUrl) {
        try {
          await fetch(slackWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
              message: `The Prismic linting script has found ${pluralize(errors.length, 'thing')} that require${errors.length > 1 ? '' : 's'} your attention.`,
            }),
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  const s3Client = new S3Client({ region: 'eu-west-1' });

  console.log('Uploading Prismic linting reporting to S3');
  const putObjectCommand = new PutObjectCommand({
    Bucket: 'dash.wellcomecollection.org',
    Key: 'prismic-linting/report.json',
    Body: JSON.stringify({
      errors: allErrors,
      totalErrors,
      ref: snapshotFile.split('.')[snapshotFile.split('.').length - 1],
      createdDate: new Date().toString(),
    }),
    ACL: 'public-read',
    ContentType: 'application/json',
  });

  await s3Client.send(putObjectCommand);

  const cloudFrontClient = new CloudFrontClient({ region: 'eu-west-1' });
  const command = new CreateInvalidationCommand({
    DistributionId: 'EIOS79GG23UUY',
    InvalidationBatch: {
      Paths: { Items: [`/prismic-linting/report.json`], Quantity: 1 },
      CallerReference: `PrismicModelInvalidationCallerReference${Date.now()}`,
    },
  });
  await cloudFrontClient.send(command);

  if (totalErrors === 0) {
    console.log(chalk.green('✅ No errors detected'));
  } else {
    console.log(
      chalk.red(`🚨 ${totalErrors} error${totalErrors > 1 ? 's' : ''} detected`)
    );
  }
}

run().catch(err => {
  error(err);
  process.exit(1);
});
