import { NextApiRequest, NextApiResponse } from 'next';

import {
  newsletterAddressBook,
  secondaryAddressBooks,
} from '@weco/common/data/dotdigital';
import { isUndefined } from '@weco/common/utils/type-guards';

const dotdigitalUsername = process.env.dotdigital_username;
const dotdigitalPassword = process.env.dotdigital_password;

type Status = 'ok' | 'error';

async function createSubscription({
  emailAddress,
  addressBookId,
  marketingPermissions,
}: {
  emailAddress: string;
  addressBookId: string;
  marketingPermissions: boolean;
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
    ...(marketingPermissions && {
      dataFields: [{ key: 'MARKETINGPERMISSIONS', value: 'on' }],
    }),
  });
  const resubscribeBody = JSON.stringify({
    UnsubscribedContact: {
      Email: emailAddress,
      ...(marketingPermissions && {
        dataFields: [{ key: 'MARKETINGPERMISSIONS', value: 'on' }],
      }),
    },
  });

  // …and try to add it to the correct address book
  const newResponse = await fetch(
    `${newsletterApiUrl}/address-books/${addressBookId}/contacts`,
    {
      method: 'POST',
      headers,
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
        headers,
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

const validAddressBookIds = [
  newsletterAddressBook,
  ...secondaryAddressBooks,
].map(addressbook => addressbook.id);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // making sure addressBookId is legit to prevent server-side request forgery
  if (!validAddressBookIds.includes(Number(req.body.addressBookId))) {
    res.status(400).send('Bad request');
  }
  if (req.method === 'POST') {
    try {
      const { addressBookId, emailAddress, marketingPermissions } = req.body;
      const result = await createSubscription({
        emailAddress,
        addressBookId,
        marketingPermissions,
      });

      res.status(200).json({ result });
    } catch {
      res.status(500).json({ error: 'failed to load data' });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};

export default handler;
