// This is copy for the identity web app that's hard-coded, rather than fetched from Prismic.
//
// It's longer than microcopy so it doesn't live in the microcopy file (microcopy.tsx), but
// we keep it in one place for similar reasons:
//
//    - All this text can be reviewed for consistency
//    - It's easier for non-developers to work out if something is hard-coded, and isn't
//      something they can update on their own, e.g. if the Editorial team are wondering
//      why they can't update some text in Prismic.
//

import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import Divider from '@weco/common/views/components/Divider';
import Space from '@weco/common/views/components/styled/Space';
import { ExternalLink } from '@weco/identity/views/components/Registration/Registration.styles';
import { SectionHeading } from '@weco/identity/views/components/styled/layouts';

type ValidatedSuccessTextProps = {
  isNewSignUp: boolean;
};

export const ValidatedSuccessText: FunctionComponent<
  ValidatedSuccessTextProps
> = ({ isNewSignUp }: ValidatedSuccessTextProps) => (
  <>
    <SectionHeading as="h1">Email verified</SectionHeading>
    <p>Thank you for verifying your email address.</p>
    {isNewSignUp && (
      <div data-testid="new-sign-up">
        <p>
          You can now request up to 15 items from our closed stores in the
          library.
        </p>
        <p>
          To complete your membership and access subscription databases,
          e-journals and e-books, you’ll need to bring a form of photo
          identification (ID) and proof of your address to our admissions desk
          when you visit. The identification we accept is detailed on our{' '}
          <a
            href={`https://wellcomecollection.org/collections/${prismicPageIds.register}`}
          >
            Library membership page
          </a>
          .
        </p>
      </div>
    )}
  </>
);

export const ValidatedFailedText: FunctionComponent<{
  message: string | string[];
}> = ({ message }) => (
  <>
    <SectionHeading as="h1">Failed to verify email</SectionHeading>
    <p>{message}</p>
    <p>
      If you need help, please{' '}
      <a href="mailto:library@wellcomecollection.org">contact the library</a>.
    </p>
  </>
);

export const ApplicationReceived: FunctionComponent<{ email: string }> = ({
  email,
}) => (
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
        To complete your membership and access subscription databases,
        e-journals and e-books, you’ll need to bring a form of photo
        identification (ID) and proof of your address to our admissions desk
        when you visit. The identification we accept is detailed on our{' '}
        <a
          href={`https://wellcomecollection.org/collections/${prismicPageIds.register}`}
        >
          Library membership page
        </a>
        .
      </p>
      <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
        <Divider />
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

export const collectionsResearchAgreementTitle =
  'Collections research agreement';

export const collectionsResearchAgreementLabel = (
  <>
    I will use personal data on living persons for research purposes only. I
    will not use personal data to support decisions about the person who is the
    subject of the data, or in a way that causes substantial damage or distress
    to them. I have read and accept the regulations detailed in the{' '}
    <ExternalLink
      href="https://wellcome.org/about-us/governance/privacy-and-terms"
      target="_blank"
      rel="noopener noreferrer"
    >
      Library’s Terms & Conditions of Use
    </ExternalLink>
    .{' '}
  </>
);

export const DeleteRequestedText: FunctionComponent = () => (
  <>
    <SectionHeading as="h1">Delete request received</SectionHeading>

    <p>Your request for account deletion has been received.</p>

    <p>
      Our Library enquiries team will now progress your request. If there are
      any issues they will be in touch otherwise your account will be removed.
    </p>
    <p>
      <a href="/">Return to homepage</a>
    </p>
  </>
);
