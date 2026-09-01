import { useEffect, useState } from 'react';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { TransformedCanvas } from '@weco/content/types/manifest';
import { hasRestrictedItem } from '@weco/content/utils/iiif/v3';

export type ProbeStatus = 'ok' | 'probing' | 'failed';

const BASE_DELAY = 400;
const MAX_DELAY = 5000;
// After this many failed attempts we stop polling and report 'failed'
// rather than leaving the caller waiting (and the image hidden) forever.
const MAX_PROBE_ATTEMPTS = 6;
// invalidateProbe bounds itself too: if media keeps failing to load for a
// reason unrelated to the auth cookie (the probe keeps reporting success),
// re-probing on every failure would otherwise cycle forever — the cookie
// checks out fine each time, so MAX_PROBE_ATTEMPTS above never kicks in.
const MAX_INVALIDATIONS = 5;
// Invalidations spaced further apart than this are treated as separate,
// presumably-legitimate incidents (e.g. the ~10-minute cookie expiry from
// docs/restricted-access-authentication-flow.md) rather than a tight loop,
// so the count resets instead of accumulating across an entire session.
const INVALIDATION_WINDOW_MS = 30_000;
// Delay before re-probing on each successive invalidation (doubling, same
// shape as the probe's own backoff). Without this, a real image that just
// needs a few more seconds for the cookie/CDN state to catch up — not a
// broken cookie — can burn through MAX_INVALIDATIONS in well under a
// second, since each invalidate → probe-succeeds → image-fails-again cycle
// completes almost instantly on its own. This gives that propagation delay
// an actual chance to resolve before the budget runs out.
const INVALIDATION_BASE_DELAY = 1000;
const INVALIDATION_MAX_DELAY = 8000;

type RegistryEntry = {
  status: ProbeStatus;
  attempts: number;
  // Counts invalidateProbe calls (not initial probe attempts) within
  // INVALIDATION_WINDOW_MS of each other — see MAX_INVALIDATIONS above.
  invalidations: number;
  lastInvalidatedAt: number | undefined;
  cancelled: boolean;
  listeners: Set<(status: ProbeStatus) => void>;
  probeUrl: string;
  accessToken: string | undefined;
};

// Shared across every mounted hook instance so that, e.g., the main viewer
// image and its own visible thumbnail don't each poll the same canvas's
// probe service independently.
const registry = new Map<string, RegistryEntry>();

function notify(entry: RegistryEntry) {
  entry.listeners.forEach(listener => listener(entry.status));
}

function pollProbe(
  canvasId: string,
  probeUrl: string,
  accessToken: string | undefined,
  entry: RegistryEntry
) {
  if (entry.cancelled) return;
  fetch(probeUrl, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  })
    .then(r => r.json())
    .then((data: { status?: number }) => {
      if (entry.cancelled) return;
      if (data.status === 200) {
        entry.status = 'ok';
        notify(entry);
      } else {
        scheduleRetry(canvasId, probeUrl, accessToken, entry);
      }
    })
    .catch(() => {
      if (entry.cancelled) return;
      scheduleRetry(canvasId, probeUrl, accessToken, entry);
    });
}

function scheduleRetry(
  canvasId: string,
  probeUrl: string,
  accessToken: string | undefined,
  entry: RegistryEntry
) {
  if (entry.cancelled) return;
  entry.attempts++;
  if (entry.attempts >= MAX_PROBE_ATTEMPTS) {
    entry.status = 'failed';
    notify(entry);
    return;
  }
  const delay = Math.min(BASE_DELAY * 2 ** entry.attempts, MAX_DELAY);
  setTimeout(() => pollProbe(canvasId, probeUrl, accessToken, entry), delay);
}

function startProbing(
  canvasId: string,
  probeUrl: string,
  accessToken: string | undefined,
  invalidations = 0,
  lastInvalidatedAt: number | undefined = undefined,
  initialDelayMs = 0
): RegistryEntry {
  const entry: RegistryEntry = {
    status: 'probing',
    attempts: 0,
    invalidations,
    lastInvalidatedAt,
    cancelled: false,
    listeners: new Set(),
    probeUrl,
    accessToken,
  };
  registry.set(canvasId, entry);
  if (initialDelayMs > 0) {
    setTimeout(
      () => pollProbe(canvasId, probeUrl, accessToken, entry),
      initialDelayMs
    );
  } else {
    pollProbe(canvasId, probeUrl, accessToken, entry);
  }
  return entry;
}

/**
 * Test-only: clears every in-flight/resolved probe so each test starts from
 * a clean slate rather than sharing state via the module-level registry.
 */
export function __resetProbeRegistryForTests() {
  registry.forEach(entry => {
    entry.cancelled = true;
  });
  registry.clear();
}

/**
 * Forces a fresh probe cycle for a canvas whose media just failed to load
 * again (e.g. the auth cookie may have expired). Callers that already
 * subscribed via useIIIFProbeService are notified immediately with
 * 'probing', so they can hide the stale media right away.
 *
 * Bounded by MAX_INVALIDATIONS: after repeated invalidations without the
 * probe itself ever failing, the auth cookie clearly isn't the problem, so
 * this reports 'failed' directly instead of re-probing (and re-showing
 * media that will just fail again) forever. That count lives here, on the
 * shared registry entry, rather than in the caller's component state,
 * because the caller typically unmounts/remounts on every cycle (its
 * probeStatus gate hides stale media), which would otherwise reset a
 * local counter every time.
 *
 * Each successive invalidation also delays before actually re-probing
 * (INVALIDATION_BASE_DELAY, doubling), so a real image that just needs a
 * few more seconds to propagate gets an actual chance to, rather than the
 * budget being exhausted near-instantly by a tight fail/succeed/fail loop.
 *
 * No-ops if nothing has ever probed this canvas — there's nothing to
 * invalidate, and the next mount will start a probe of its own.
 */
export function invalidateProbe(canvasId: string) {
  const existing = registry.get(canvasId);
  if (!existing) return;
  existing.cancelled = true;

  const now = Date.now();
  const isWithinWindow =
    existing.lastInvalidatedAt !== undefined &&
    now - existing.lastInvalidatedAt < INVALIDATION_WINDOW_MS;
  const invalidations = isWithinWindow ? existing.invalidations + 1 : 1;

  if (invalidations >= MAX_INVALIDATIONS) {
    existing.status = 'failed';
    existing.invalidations = invalidations;
    existing.lastInvalidatedAt = now;
    notify(existing);
    return;
  }

  const delay = Math.min(
    INVALIDATION_BASE_DELAY * 2 ** (invalidations - 1),
    INVALIDATION_MAX_DELAY
  );
  const entry = startProbing(
    canvasId,
    existing.probeUrl,
    existing.accessToken,
    invalidations,
    now,
    delay
  );
  existing.listeners.forEach(listener => entry.listeners.add(listener));
  notify(entry);
}

/**
 * Polls the IIIF probe service for a restricted canvas to confirm the auth
 * cookie is valid before rendering media. Returns 'ok' immediately for
 * non-restricted canvases, and for restricted canvases only once the probe
 * has genuinely returned `{ status: 200 }`.
 *
 * Never reports 'ok' on a guess: rendering on a guess just moves the failed
 * request from the probe endpoint to the real image request, which is the
 * exact race this hook exists to avoid. After MAX_PROBE_ATTEMPTS without a
 * real 200, reports 'failed' instead of polling forever.
 *
 * Multiple components probing the same canvas (e.g. the main viewer image
 * and its own visible thumbnail) share a single underlying poll via a
 * module-level registry keyed by canvas ID.
 */
const useIIIFProbeService = (
  canvas: TransformedCanvas | undefined
): ProbeStatus => {
  const { userIsStaffWithRestricted } = useUserContext();
  const { accessToken } = useItemViewerContext();
  const isRestricted = Boolean(canvas && hasRestrictedItem(canvas));

  const [status, setStatus] = useState<ProbeStatus>(
    isRestricted ? 'probing' : 'ok'
  );

  useEffect(() => {
    if (!canvas || !isRestricted) {
      setStatus('ok');
      return;
    }
    if (!accessToken || !userIsStaffWithRestricted) return;

    const probeUrl = canvas.probeServiceId;
    if (!probeUrl) {
      setStatus('ok');
      return;
    }

    let entry = registry.get(canvas.id);
    // Start fresh if nothing's probing this canvas yet, or if what's there
    // was for a different access token — a stale 'ok'/'failed' entry from
    // an earlier token must not be reused as-is once the token has changed.
    if (!entry || entry.cancelled || entry.accessToken !== accessToken) {
      if (entry) entry.cancelled = true;
      entry = startProbing(canvas.id, probeUrl, accessToken);
    }

    const listener = (nextStatus: ProbeStatus) => setStatus(nextStatus);
    entry.listeners.add(listener);
    setStatus(entry.status);

    return () => {
      entry?.listeners.delete(listener);
    };
  }, [
    accessToken,
    userIsStaffWithRestricted,
    canvas?.id,
    canvas?.probeServiceId,
    isRestricted,
  ]);

  return status;
};

export default useIIIFProbeService;
