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
  downwardOffset?: number;
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
  downwardOffset = 20,
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

  // Update portal position when hover position changes
  useEffect(() => {
    if (!portalRef.current || !triggerRef.current) return;

    const portal = portalRef.current;
    const trigger = triggerRef.current;
    const triggerRect = trigger.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;

    // Position relative to the trigger element
    let topPosition = triggerRect.height + defaultOffset;
    let leftPosition = (triggerRect.width - portalWidth) / 2;

    // Check if the portal would go below the viewport when positioned absolutely
    const absoluteTop = triggerRect.top + topPosition;
    if (absoluteTop + portalHeight > viewportHeight) {
      // Not enough space below, position above the trigger
      topPosition = -portalHeight - defaultOffset;
    }

    // Check if the portal would go off the right edge
    const absoluteLeft = triggerRect.left + leftPosition;
    if (absoluteLeft + portalWidth > viewportWidth) {
      leftPosition =
        viewportWidth - triggerRect.left - portalWidth - viewportPadding;
    }

    // Check if the portal would go off the left edge
    if (absoluteLeft < viewportPadding) {
      leftPosition = viewportPadding - triggerRect.left;
    }

    portal.style.top = `${topPosition}px`;
    portal.style.left = `${leftPosition}px`;
  }, [
    hoverPosition,
    portalWidth,
    portalHeight,
    defaultOffset,
    downwardOffset,
    viewportPadding,
    triggerRef,
  ]);

  const handleTriggerMouseEnter = useCallback(
    (event: ReactMouseEvent) => {
      isHoveringTrigger.current = true;
      clearHideTimeout();
      // For absolute positioning, we still track mouse position for direction detection
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
