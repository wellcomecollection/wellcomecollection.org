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

import Divider from '@weco/common/views/components/Divider/Divider';
import Space from '@weco/common/views/components/styled/Space';
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

export const ApplicationReceived: FC<{ email: string }> = ({ email }) => (
  <>
    <SectionHeading as="h1">Application received</SectionHeading>
    <div className="body-text">
      <p>Thank you for applying for a library membership.</p>
      <p>
        Please click the verification link in the email we’ve just sent to{' '}
        <strong>{email}</strong>.
      </p>
      <p>
        <strong>Please do this within the next 24 hours.</strong>
      </p>
      <p>
        Once you have verified your email address, you will be able to request
        up to 15 items from our closed stores to view in the library.
      </p>
      <p>
        If you want to access subscription databases, e-journals and e-books,
        you need to bring a form of personal identification (ID) and proof of
        address to the admissions desk in the library.
      </p>
      <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
        <Divider color={`pumice`} isKeyline />
      </Space>
      <p>
        <strong>Didn’t receive an email?</strong>
      </p>
      <p>
        If you still don’t see an email from us within the next few minutes, try
        checking your junk or spam folder.
      </p>
      <p>
        If you need more help please{' '}
        <a href="mailto:library@wellcomecollection.org">contact the library</a>.
      </p>
    </div>
  </>
);
