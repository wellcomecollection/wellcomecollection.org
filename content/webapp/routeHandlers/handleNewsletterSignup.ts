import { isUndefined } from '@weco/common/utils/type-guards';
import fetch from 'node-fetch';

const dotdigitalUsername = process.env.dotdigital_username;
const dotdigitalPassword = process.env.dotdigital_password;

type Status = 'ok' | 'error';

async function createSubscription({
  emailAddress,
  addressBookId,
}: {
  emailAddress: string;
  addressBookId: string;
}): Promise<Status> {
  const newsletterApiUrl = 'https://r1-api.dotmailer.com/v2';

  // This should never happen in practice, but it's a useful hint for
  // anybody doing local development and wondering why sign-ups are
  // failing.  These should always be configured in the prod app.
  if (
    dotdigitalUsername === '' ||
    dotdigitalPassword === '' ||
    isUndefined(dotdigitalUsername) ||
    isUndefined(dotdigitalPassword)
  ) {
    console.warn('Missing dotdigital credentials; newsletter sign-up may fail');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(
      `${dotdigitalUsername}:${dotdigitalPassword}`
    ).toString('base64')}`,
  };

  // We first assume the email address is new…
  const newBody = JSON.stringify({
    Email: emailAddress,
    OptInType: 'VerifiedDouble',
  });
  const resubscribeBody = JSON.stringify({
    UnsubscribedContact: {
      Email: emailAddress,
    },
  });
  // …and try to add it to the correct address book
  const newResponse = await fetch(
    `${newsletterApiUrl}/address-books/${addressBookId}/contacts`,
    {
      method: 'POST',
      headers: headers,
      body: newBody,
    }
  );
  const newJson = await newResponse.json();
  const { message } = newJson;
  const isSuppressed = message && message.match(/ERROR_CONTACT_SUPPRESSED/);

  let status = '';

  // …but if the email has been suppressed, we resubscribe it
  if (isSuppressed) {
    const resubscribeResponse = await fetch(
      `${newsletterApiUrl}/contacts/resubscribe`,
      {
        method: 'POST',
        headers: headers,
        body: resubscribeBody,
      }
    );

    const resubscribeJson = await resubscribeResponse.json();
    status = resubscribeJson.status;
  } else {
    status = newJson.status;
  }

  switch (status) {
    case 'ContactChallenged':
    case 'ContactAdded':
    case 'PendingOptIn':
    case 'Subscribed':
      return 'ok';

    default:
      return 'error';
  }
}

async function handleNewsletterSignup(ctx, next): Promise<void> {
  const { addressBookId, emailAddress } = ctx.request.body;
  const result = await createSubscription({
    emailAddress,
    addressBookId,
  });

  ctx.body = { result };

  next();
}

export default handleNewsletterSignup;
