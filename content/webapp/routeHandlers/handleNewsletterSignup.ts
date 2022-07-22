import fetch from 'node-fetch';

const dotdigitalUsername = process.env.dotdigital_username;
const dotdigitalPassword = process.env.dotdigital_password;

async function handleNewsletterSignup(ctx, next) {
  const { addressbookid, email } = ctx.request.body;
  const newsletterApiUrl = 'https://r1-api.dotmailer.com/v2';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(
      `${dotdigitalUsername}:${dotdigitalPassword}`
    ).toString('base64')}`,
  };
  // We first assume the email address is new…
  const newBody = JSON.stringify({
    Email: email,
    OptInType: 'VerifiedDouble',
  });
  const resubscribeBody = JSON.stringify({
    UnsubscribedContact: {
      Email: email,
    },
  });
  // …and try to add it to the correct address book
  const newResponse = await fetch(
    `${newsletterApiUrl}/address-books/${addressbookid}/contacts`,
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
      ctx.body = { result: 'ok' };
      break;

    default:
      ctx.body = { result: 'error' };
      break;
  }

  next();
}

export default handleNewsletterSignup;
