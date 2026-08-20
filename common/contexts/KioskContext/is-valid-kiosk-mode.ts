import { KioskModeOptionId } from '@weco/toggles';
import toggleConfig from '@weco/toggles/toggles';

// Valid kiosk mode IDs extracted from toggles config
const VALID_KIOSK_MODE_IDS =
  toggleConfig.modes
    .find(mode => mode.id === 'kioskMode')
    ?.options.map(option => option.id) ?? [];

/**
 * Validates that a cookie value is a valid kiosk mode option ID.
 * Use this server-side to validate the toggle_kioskMode cookie before using it.
 *
 * This is deliberately kept in its own module, separate from KioskContext/index.tsx (which it's
 * conceptually part of) - AppContext and civic-uk.ts both need this check, but pulling it in via
 * the KioskContext barrel would make KioskContext's React Context/Provider code (and anything else
 * added there, e.g. HistoryProvider previously) part of every app's module graph, including
 * identity's, which doesn't use kiosk mode at all. See _app.tsx for the history of why that
 * mattered.
 */
export function isValidKioskMode(value: unknown): value is KioskModeOptionId {
  return (
    typeof value === 'string' &&
    (VALID_KIOSK_MODE_IDS as readonly string[]).includes(value)
  );
}
