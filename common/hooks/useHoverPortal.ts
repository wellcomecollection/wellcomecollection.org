import {
  MouseEvent as ReactMouseEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type MouseDirection = 'up' | 'down' | 'none';

type UseHoverPortalOptions = {
  portalWidth?: number;
  portalHeight?: number;
  defaultOffset?: number;
  downwardOffset?: number;
  viewportPadding?: number;
  hideDelay?: number;
};

type UseHoverPortalReturn = {
  portalRef: RefObject<HTMLElement | null>;
  hoverPosition: { x: number; y: number };
  isVisible: boolean;
  handleTriggerMouseEnter: (event: ReactMouseEvent) => void;
  handleTriggerMouseLeave: () => void;
};

export const useHoverPortal = ({
  portalWidth = 362,
  portalHeight = 96,
  defaultOffset = 10,
  downwardOffset = 20,
  viewportPadding = 10,
  hideDelay = 300,
}: UseHoverPortalOptions = {}): UseHoverPortalReturn => {
  const portalRef = useRef<HTMLElement | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousMousePosition = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const mouseDirection = useRef<MouseDirection>('none');
  const isHoveringTrigger = useRef(false);
  const isHoveringPortal = useRef(false);

  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  // Clear any pending hide timeout
  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  // Schedule hiding with delay
  const scheduleHide = useCallback(() => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      if (!isHoveringTrigger.current && !isHoveringPortal.current) {
        setIsVisible(false);
      }
    }, hideDelay);
  }, [hideDelay, clearHideTimeout]);

  // Track global mouse movement to determine direction
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const currentY = event.clientY;
      const previousY = previousMousePosition.current.y;

      if (previousY !== 0) {
        if (currentY > previousY) {
          mouseDirection.current = 'down';
        } else if (currentY < previousY) {
          mouseDirection.current = 'up';
        }
      }

      previousMousePosition.current = { x: event.clientX, y: event.clientY };

      // Check if mouse is over portal when visible
      if (isVisible && portalRef.current) {
        const portal = portalRef.current;
        const rect = portal.getBoundingClientRect();
        const isOverPortal =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        if (isOverPortal && !isHoveringPortal.current) {
          isHoveringPortal.current = true;
          clearHideTimeout();
        } else if (!isOverPortal && isHoveringPortal.current) {
          isHoveringPortal.current = false;
          scheduleHide();
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible, clearHideTimeout, scheduleHide]);

  // Update portal position when hover position changes
  useEffect(() => {
    if (!portalRef.current) return;

    const portal = portalRef.current;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;

    // Use increased offset when mouse was moving down
    const baseOffset =
      mouseDirection.current === 'down' ? downwardOffset : defaultOffset;
    let topPosition = hoverPosition.y + baseOffset;

    // Center horizontally around the hover position
    let leftPosition = hoverPosition.x - portalWidth / 2;

    // Check if the portal would go below the viewport
    if (topPosition + portalHeight > viewportHeight) {
      // Not enough space below, position above the hover point
      topPosition = hoverPosition.y - portalHeight - defaultOffset;
    }

    // Ensure the portal doesn't go off the left or right edge
    if (leftPosition + portalWidth > viewportWidth) {
      leftPosition = viewportWidth - portalWidth - viewportPadding;
    }

    if (leftPosition < viewportPadding) {
      leftPosition = viewportPadding;
    }

    portal.style.top = `${Math.max(viewportPadding, topPosition)}px`;
    portal.style.left = `${leftPosition}px`;
  }, [
    hoverPosition,
    portalWidth,
    portalHeight,
    defaultOffset,
    downwardOffset,
    viewportPadding,
  ]);

  const handleTriggerMouseEnter = useCallback(
    (event: ReactMouseEvent) => {
      isHoveringTrigger.current = true;
      clearHideTimeout();
      setHoverPosition({ x: event.clientX, y: event.clientY });
      setIsVisible(true);
    },
    [clearHideTimeout]
  );

  const handleTriggerMouseLeave = useCallback(() => {
    isHoveringTrigger.current = false;
    scheduleHide();
  }, [scheduleHide]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearHideTimeout();
    };
  }, [clearHideTimeout]);

  return {
    portalRef,
    hoverPosition,
    isVisible,
    handleTriggerMouseEnter,
    handleTriggerMouseLeave,
  };
};
