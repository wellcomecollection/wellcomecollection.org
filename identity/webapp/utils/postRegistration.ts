import { URLSearchParams } from 'url';

// A brand-new signup gets a placeholder name until Auth0 next syncs from
// Sierra (which only happens on a fresh login). We treat this placeholder
// as our signal that registration just completed.
const PLACEHOLDER_LAST_NAME = 'Auth0_Registration_tempLastName';

export function isFreshRegistration(familyName?: string): boolean {
  return familyName === PLACEHOLDER_LAST_NAME;
}

export function logoutToSuccessUrl(email: string): string {
  const successParams = new URLSearchParams();
  successParams.append('email', email);

  const params = new URLSearchParams();
  params.append('returnTo', `/success?${successParams}`);

  return `/api/auth/logout?${params}`;
}
