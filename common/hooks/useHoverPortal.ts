import { useEffect, useRef, useState } from 'react';

type MouseDirection = 'up' | 'down' | 'none';

interface UseHoverPortalOptions {
  portalWidth?: number;
  portalHeight?: number;
  defaultOffset?: number;
  downwardOffset?: number;
  viewportPadding?: number;
}

interface UseHoverPortalReturn {
  portalRef: React.RefObject<HTMLElement | null>;
  hoverPosition: { x: number; y: number };
  mouseDirection: MouseDirection;
  handleMouseEnter: (event: React.MouseEvent) => void;
}

export const useHoverPortal = ({
  portalWidth = 362,
  portalHeight = 96,
  defaultOffset = 10,
  downwardOffset = 20,
  viewportPadding = 10,
}: UseHoverPortalOptions = {}): UseHoverPortalReturn => {
  const portalRef = useRef<HTMLElement | null>(null);
  const previousMousePosition = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const mouseDirection = useRef<MouseDirection>('none');

  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

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
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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

  const handleMouseEnter = (event: React.MouseEvent) => {
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  return {
    portalRef,
    hoverPosition,
    mouseDirection: mouseDirection.current,
    handleMouseEnter,
  };
};
