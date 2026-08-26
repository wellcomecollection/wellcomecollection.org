import { useEffect, useRef, useState } from 'react';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { TransformedCanvas } from '@weco/content/types/manifest';
import { hasRestrictedItem } from '@weco/content/utils/iiif/v3';

/**
 * Polls the IIIF probe service for a restricted canvas to confirm the auth
 * cookie is valid before rendering media. Returns `probeOk: true` immediately
 * for non-restricted canvases, and for restricted canvases only once the
 * probe has genuinely returned `{ status: 200 }`.
 *
 * Deliberately never falls back to `true` on a timeout: rendering on a guess
 * just moves the failed request from the probe endpoint to the real image
 * request, which is the exact race this hook exists to avoid. Retries
 * indefinitely (with backoff) until it gets a real answer or the canvas
 * changes/component unmounts.
 */
const useIIIFProbeService = (canvas: TransformedCanvas): boolean => {
  const { userIsStaffWithRestricted } = useUserContext();
  const { accessToken } = useItemViewerContext();
  const isRestricted = hasRestrictedItem(canvas);

  const [probeOk, setProbeOk] = useState(!isRestricted);

  // Tracks which canvas ID the probe last genuinely succeeded for (status 200).
  // Token refreshes on the same canvas skip re-probing to avoid a race where
  // the probe resolves before the refreshed cookie is ready for image requests.
  // Only a real success is recorded here — if the retry budget was exhausted
  // instead, a later token refresh (e.g. after an image load error) must be
  // able to trigger a fresh probe rather than being skipped forever.
  const probeSucceededForCanvas = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!isRestricted) {
      setProbeOk(true);
      return;
    }
    if (!accessToken || !userIsStaffWithRestricted) return;
    if (probeSucceededForCanvas.current === canvas.id) return;

    const probeUrl = canvas.probeServiceId;
    if (!probeUrl) {
      probeSucceededForCanvas.current = canvas.id;
      setProbeOk(true);
      return;
    }

    setProbeOk(false);

    let cancelled = false;
    const BASE_DELAY = 400;
    const MAX_DELAY = 5000;
    let attempts = 0;

    function scheduleRetry() {
      if (cancelled) return;
      const delay = Math.min(BASE_DELAY * 2 ** attempts, MAX_DELAY);
      attempts++;
      setTimeout(pollProbe, delay);
    }

    function pollProbe() {
      if (cancelled) return;
      fetch(probeUrl!, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      })
        .then(r => r.json())
        .then((data: { status?: number }) => {
          if (cancelled) return;
          if (data.status === 200) {
            probeSucceededForCanvas.current = canvas.id;
            setProbeOk(true);
          } else {
            scheduleRetry();
          }
        })
        .catch(() => {
          if (cancelled) return;
          scheduleRetry();
        });
    }

    pollProbe();
    return () => {
      cancelled = true;
    };
  }, [
    accessToken,
    userIsStaffWithRestricted,
    canvas.id,
    canvas.probeServiceId,
    isRestricted,
  ]);

  return probeOk;
};

export default useIIIFProbeService;
