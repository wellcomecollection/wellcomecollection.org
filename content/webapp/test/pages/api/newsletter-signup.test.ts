/**
 * @jest-environment node
 */
import { NextApiRequest, NextApiResponse } from 'next';

import { newsletterAddressBook } from '@weco/common/data/dotdigital';
import handler from '@weco/content/pages/api/newsletter-signup';

type RecordedResponse = NextApiResponse & {
  statusCode: number;
  body?: unknown;
};

const makeRequest = (method: string, body: unknown) =>
  ({ method, body }) as unknown as NextApiRequest;

const makeResponse = (): RecordedResponse => {
  const res = {
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      res.body = payload;
      return res;
    },
    send(payload: unknown) {
      res.body = payload;
      return res;
    },
  };
  return res as unknown as RecordedResponse;
};

const originalFetch = global.fetch;

describe('/api/newsletter-signup', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({
      json: async () => ({ status: 'PendingOptIn' }),
    });
    global.fetch = fetchMock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it.each([
    ['an unknown id', 999],
    ['a path', '../../v2/contacts?'],
    ['nothing', undefined],
  ])('rejects %s without calling dotdigital', async (_, addressBookId) => {
    const res = makeResponse();
    await handler(
      makeRequest('POST', {
        addressBookId,
        emailAddress: 'someone@example.com',
      }),
      res
    );

    expect(res.statusCode).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects other methods', async () => {
    const res = makeResponse();
    await handler(makeRequest('GET', undefined), res);

    expect(res.statusCode).toBe(405);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('subscribes to a known address book', async () => {
    const res = makeResponse();
    await handler(
      makeRequest('POST', {
        addressBookId: String(newsletterAddressBook.id),
        emailAddress: 'someone@example.com',
        marketingPermissions: false,
      }),
      res
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ result: 'ok' });
    expect(fetchMock).toHaveBeenCalledWith(
      `https://r1-api.dotmailer.com/v2/address-books/${newsletterAddressBook.id}/contacts`,
      expect.objectContaining({ method: 'POST' })
    );
  });
});
