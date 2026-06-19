import type { SessionData } from '@auth0/nextjs-auth0/types';

// The namespaced patron claims the rest of the site relies on (see
// isFullAuth0Profile in common/model/user.ts).
//
// These are added to the ID token by the "add custom claims" Auth0 Action
// (wellcomecollection/identity), but only when the matching `weco:` scope is in
// event.transaction.requested_scopes. That is populated on interactive logins
// but NOT on refresh-token grants, so a refreshed ID token has no patron
// claims. Because v4 rebuilds session.user from whichever ID token it last saw,
// a token refresh would otherwise overwrite session.user with a claim-less
// refreshed token and drop these claims, breaking isFullAuth0Profile /
// UserContextProvider across every webapp. (v3 stored the login claims once and
// never re-derived them on refresh, so it never surfaced.)
export const patronClaims = [
  'https://wellcomecollection.org/patron_barcode',
  'https://wellcomecollection.org/patron_role',
];

// A non-claim session field used only to carry the patron claims across token
// refreshes. It round-trips through the encrypted session cookie and is never
// exposed to clients (the /api/auth/me endpoint returns session.user only).
const patronClaimsStashKey = 'wecoPatronClaims';

/**
 * Keep the namespaced patron claims on `session.user` across token refreshes.
 *
 * Runs from the `beforeSessionSaved` hook, which fires on every session save
 * (interactive login and every refresh):
 *  - when the claims are present (login), they are (re)stashed into the session;
 *  - when they are absent (a refresh-token grant dropped them), they are
 *    restored onto `session.user` from the stash.
 *
 * Login claims always win over the stash, so a profile change picked up at the
 * next login takes effect.
 */
export const preservePatronClaims = (session: SessionData): SessionData => {
  // Copy so we don't mutate the input; keep the User type for the return, and
  // use a wider view to read/write the namespaced claim keys.
  const user = { ...session.user };
  const claims = user as Record<string, unknown>;
  const stash = (session as Record<string, unknown>)[patronClaimsStashKey] as
    | Record<string, unknown>
    | undefined;

  for (const claim of patronClaims) {
    if (claims[claim] === undefined && stash?.[claim] !== undefined) {
      claims[claim] = stash[claim];
    }
  }

  return {
    ...session,
    user,
    [patronClaimsStashKey]: Object.fromEntries(
      patronClaims.map(claim => [claim, claims[claim]])
    ),
  } as SessionData;
};
