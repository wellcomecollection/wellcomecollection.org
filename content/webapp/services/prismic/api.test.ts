import { GetServerSidePropsContext } from 'next';
import { api } from './api';

it('can only be initialised once per request', () => {
  const req = {
    cookies: {},
  } as GetServerSidePropsContext['req'];

  const firstApi = api(req);
  expect(firstApi.endpoint).toBe(
    'https://wellcomecollection.cdn.prismic.io/api/v2'
  );

  expect(() => api(req)).toThrow(Error);
});
