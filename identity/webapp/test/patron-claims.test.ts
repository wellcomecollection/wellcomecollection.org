import { preservePatronClaims } from '@weco/identity/utils/patron-claims';

const barcodeClaim = 'https://wellcomecollection.org/patron_barcode';
const roleClaim = 'https://wellcomecollection.org/patron_role';

// A minimal SessionData-shaped object; only `user` and the stash field matter
// for preservePatronClaims.
const makeSession = (
  user: Record<string, unknown>,
  extra: Record<string, unknown> = {}
) =>
  ({
    user,
    tokenSet: {},
    internal: { sid: 'sid', createdAt: 0 },
    ...extra,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;

const userClaims = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any
): Record<string, unknown> => session.user as Record<string, unknown>;

describe('preservePatronClaims', () => {
  it('stashes the patron claims when a login provides them', () => {
    const result = preservePatronClaims(
      makeSession({
        sub: 'auth0|p1134821',
        [barcodeClaim]: '1134821',
        [roleClaim]: 'SelfRegistered',
      })
    );

    // claims stay on the user...
    expect(userClaims(result)[barcodeClaim]).toBe('1134821');
    expect(userClaims(result)[roleClaim]).toBe('SelfRegistered');
    // ...and are stashed for later refreshes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result as any).wecoPatronClaims).toEqual({
      [barcodeClaim]: '1134821',
      [roleClaim]: 'SelfRegistered',
    });
  });

  it('restores the patron claims when a refresh-token grant has dropped them', () => {
    const result = preservePatronClaims(
      makeSession(
        // a refreshed user without the namespaced claims
        { sub: 'auth0|p1134821' },
        {
          wecoPatronClaims: {
            [barcodeClaim]: '1134821',
            [roleClaim]: 'SelfRegistered',
          },
        }
      )
    );

    expect(userClaims(result)[barcodeClaim]).toBe('1134821');
    expect(userClaims(result)[roleClaim]).toBe('SelfRegistered');
  });

  it('does not invent claims when neither the token nor the stash has them', () => {
    const result = preservePatronClaims(makeSession({ sub: 'auth0|p1134821' }));

    expect(userClaims(result)[barcodeClaim]).toBeUndefined();
    expect(userClaims(result)[roleClaim]).toBeUndefined();
  });

  it('lets fresh login claims win over an older stash, and re-stashes them', () => {
    const result = preservePatronClaims(
      makeSession(
        {
          sub: 'auth0|p1134821',
          [barcodeClaim]: '1134821',
          [roleClaim]: 'Staff',
        },
        {
          wecoPatronClaims: {
            [barcodeClaim]: '1134821',
            [roleClaim]: 'SelfRegistered',
          },
        }
      )
    );

    expect(userClaims(result)[roleClaim]).toBe('Staff');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result as any).wecoPatronClaims[roleClaim]).toBe('Staff');
  });
});
