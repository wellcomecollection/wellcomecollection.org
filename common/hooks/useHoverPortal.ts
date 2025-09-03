import {
  MouseEvent as ReactMouseEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type UseHoverPortalOptions = {
  portalWidth?: number;
  portalHeight?: number;
  defaultOffset?: number;
  viewportPadding?: number;
  hideDelay?: number;
  triggerRef?: RefObject<HTMLAnchorElement | null>;
};

type UseHoverPortalReturn = {
  portalRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLAnchorElement | null>;
  hoverPosition: { x: number; y: number };
  isVisible: boolean;
  handleTriggerMouseEnter: (event: ReactMouseEvent) => void;
  handleTriggerMouseLeave: () => void;
};

export const useHoverPortal = ({
  portalWidth = 362,
  portalHeight = 96,
  defaultOffset = 10,
  viewportPadding = 10,
  hideDelay = 300,
  triggerRef: externalTriggerRef,
}: UseHoverPortalOptions = {}): UseHoverPortalReturn => {
  const portalRef = useRef<HTMLElement | null>(null);
  const internalTriggerRef = useRef<HTMLAnchorElement | null>(null);
  const triggerRef = externalTriggerRef || internalTriggerRef;
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Track global mouse movement for portal hover detection
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
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

  // Hide portal when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('scroll', handleScroll, true);
      return () => {
        document.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isVisible]);

  // Update portal position when hover position changes
  useEffect(() => {
    if (!portalRef.current) return;

    const portal = portalRef.current;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;

    // Center horizontally around the hover position
    let leftPosition = hoverPosition.x - portalWidth / 2;
    let topPosition = hoverPosition.y + defaultOffset;

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
    viewportPadding,
  ]);

  const handleTriggerMouseEnter = useCallback(
    (event: ReactMouseEvent) => {
      isHoveringTrigger.current = true;
      clearHideTimeout();
      // Track mouse position for positioning relative to trigger element
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
    triggerRef,
    hoverPosition,
    isVisible,
    handleTriggerMouseEnter,
    handleTriggerMouseLeave,
  };
};
