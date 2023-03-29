// You possibly/probably want `useToggles` instead of this. This function
// returns an array of strings denoting which toggles a user has active/inactive.
// Inactive toggles are prefixed with a !
// This output is useful for display purposes (to show someone what they have turned
// on) as well as for including alongside tracking data, in order to determine
// e.g. what condition a user was in when performing a task on the site.
export function dangerouslyGetEnabledToggles(
  cookies: Partial<{ [key: string]: string }>
): string[] {
  return Object.entries(cookies)
    .filter(([k]) => k.startsWith('toggle_'))
    .map(([k, v]) => {
      const prefix = v === 'false' ? '!' : '';
      const toggleId = k.replace('toggle_', '');
      return `${prefix}${toggleId}`;
    })
    .sort();
}
