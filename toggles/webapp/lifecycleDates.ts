/**
 * dateCreated/dateActivated are only tracked for experimental toggles - a
 * permanent toggle's public status doesn't have a rollout to track, so it
 * never carries these fields. Shared by feature flags and phased flags,
 * since going public and being tracked this way is a lifecycle the two
 * share (and a mode never has, since a mode is never "made public").
 */
export function dateCreatedFor(
  isExperimental: boolean,
  existingDateCreated?: string
): string | undefined {
  return isExperimental
    ? (existingDateCreated ?? new Date().toISOString())
    : undefined;
}

/**
 * The moment a toggle first became active/public. Preserves an existing
 * value when passed one (so a no-op deploy doesn't reset it) - pass
 * `undefined` for `existingDateActivated` when the caller is the one
 * explicitly making it active right now (e.g. setDefaultValueFor), so it
 * always gets a fresh timestamp.
 */
export function dateActivatedFor(
  isExperimental: boolean,
  isActive: boolean,
  existingDateActivated?: string
): string | undefined {
  return isExperimental && isActive
    ? (existingDateActivated ?? new Date().toISOString())
    : undefined;
}
