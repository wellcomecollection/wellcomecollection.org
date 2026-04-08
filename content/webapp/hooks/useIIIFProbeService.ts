import { useEffect, useRef, useState } from 'react';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { TransformedCanvas } from '@weco/content/types/manifest';
import { hasRestrictedItem } from '@weco/content/utils/iiif/v3';

/**
 * Polls the IIIF probe service for a restricted canvas to confirm the auth
 * cookie is valid before rendering media. Returns `probeOk: true` immediately
 * for non-restricted canvases, and for restricted canvases once the probe
 * succeeds (or the retry budget is exhausted, in which case it falls back to
 * true to avoid blocking staff indefinitely).
 */
const useIIIFProbeService = (canvas: TransformedCanvas): boolean => {
  const { userIsStaffWithRestricted } = useUserContext();
  const { accessToken } = useItemViewerContext();
  const isRestricted = hasRestrictedItem(canvas);

  const [probeOk, setProbeOk] = useState(!isRestricted);

  // Tracks which canvas ID the probe last succeeded for.
  // Token refreshes on the same canvas skip re-probing to avoid a race where
  // the probe resolves before the refreshed cookie is ready for image requests.
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
    const maxAttempts = 5;
    const delay = 400;
    let attempts = 0;

    function pollProbe() {
      if (cancelled) return;
      attempts++;
      fetch(probeUrl!, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      })
        .then(r => r.json())
        .then((data: { status?: number }) => {
          if (cancelled) return;
          if (data.status === 200) {
            probeSucceededForCanvas.current = canvas.id;
            setProbeOk(true);
          } else if (attempts < maxAttempts) {
            setTimeout(pollProbe, delay);
          } else {
            probeSucceededForCanvas.current = canvas.id;
            setProbeOk(true);
          }
        })
        .catch(() => {
          if (cancelled) return;
          if (attempts < maxAttempts) {
            setTimeout(pollProbe, delay);
          } else {
            probeSucceededForCanvas.current = canvas.id;
            setProbeOk(true);
          }
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
