// This is copy for the identity web app that's hard-coded, rather than fetched from Prismic.
//
// It's longer than microcopy so it doesn't live in the microcopy file (microcopy.ts), but
// we keep it in one place for similar reasons:
//
//    - All this text can be reviewed for consistency
//    - It's easier for non-developers to work out if something is hard-coded, and isn't
//      something they can update on their own, e.g. if the Editorial team are wondering
//      why they can't update some text in Prismic.
//

import { FC } from 'react';
import { SectionHeading } from './src/frontend/components/Layout.style';

type ValidatedSuccessTextProps = {
  isNewSignUp: boolean;
};

export const ValidatedSuccessText: FC<ValidatedSuccessTextProps> = ({
  isNewSignUp,
}: ValidatedSuccessTextProps) => (
  <>
    <SectionHeading as="h1">Email verified</SectionHeading>
    <p>Thank you for verifying your email address.</p>
    {isNewSignUp && (
      <div data-test-id="new-sign-up">
        <p>
          You can now request up to 15 items from our closed stores in the
          library.
        </p>
        <p>
          If you want to access subscription databases, e-journals and e-books,
          you need to bring a form of personal identification (ID) and proof of
          address to the admissions desk in the library.
        </p>
      </div>
    )}
  </>
);

export const ValidatedFailedText: FC<{ message: string | string[] }> = ({
  message,
}) => (
  <>
    <SectionHeading as="h1">Failed to verify email</SectionHeading>
    <p>{message}</p>
    <p>
      If you need help, please{' '}
      <a href="mailto:library@wellcomecollection.org">contact the library</a>.
    </p>
  </>
);
