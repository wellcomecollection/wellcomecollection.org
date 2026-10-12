import {
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';

// The brand update's "W" icon with a light ring, so it stands out on dark
// backgrounds as well as light ones
const brandLinkIcon = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 448"><defs><linearGradient id="g" x1="0" y1="24" x2="0" y2="472" gradientUnits="userSpaceOnUse"><stop stop-color="#ffa5dc"/><stop offset="1" stop-color="#f2824a"/></linearGradient></defs><circle cx="224" cy="224" r="216" fill="#223438" stroke="#f5f6ee" stroke-width="16"/><path transform="translate(-22 -24)" fill="url(#g)" d="M188.126 265.841L158.967 154.959L93.5654 162.573C93.5654 162.573 129.486 299.453 136.057 324.284C140.247 340.185 148.673 350.942 164.72 355.297C181.305 359.808 215.435 369.978 215.504 369.999L244.722 258.796C253.57 292.497 260.345 317.27 263.003 326.988C266.975 341.544 276.524 350.81 293.126 355.691C315.56 362.305 341.301 369.983 341.355 369.999L395.966 162.164L330.463 154.959L301.318 265.768C290.221 223.487 280.043 185.299 278.32 179.015C273.867 162.778 263.061 154.974 247.146 154.974C229.922 154.974 217.468 154.959 217.417 154.959H217.285L188.126 265.841Z"/></svg>`
)}`;

const WorkLinkWithIcon = styled.a<{ $isPortalVisible: boolean }>`
  text-decoration-style: dotted;
  text-underline-offset: 26%;
  text-decoration-thickness: 8%;
  display: inline-block;
  margin-top: 0;
  position: relative;

  &::before {
    content: '';
    position: relative;

    background-image: url(${props =>
      props.theme.brandUpdate
        ? `"${brandLinkIcon}"`
        : `'https://i.wellcomecollection.org/assets/icons/favicon-32x32.png'`});
    background-repeat: no-repeat;
    background-size: 14px; /* 14px is the smallest size it should be and we want them all to be the same */
    background-position: center;
    padding-right: 18px;
  }

  [data-portal-id] {
    pointer-events: ${props => (props.$isPortalVisible ? 'auto' : 'none')};
    z-index: 1;

    > div {
      opacity: ${props => (props.$isPortalVisible ? '1' : '0')};
      transition: opacity ${props => props.theme.transitionProperties};
    }

    ${props =>
      props.theme.mediaBetween(
        'zero',
        'sm'
      )(`
      & {
        display: none;
      }
    `)}
  }
`;

// Only returns true if the link is a link from our catalogue
const hasLinkedWork = (taslSourceLink?: string) => {
  return Boolean(
    taslSourceLink &&
    taslSourceLink.indexOf('wellcomecollection.org/works/') > -1
  );
};

const FeaturedWorkLink = ({
  link,
  children,
  ...rest
}: {
  link?: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLAnchorElement>) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLAnchorElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLSpanElement | null>(
    null
  );
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringTrigger = useRef(false);
  const isHoveringPopper = useRef(false);
  const [mouseOffset, setMouseOffset] = useState(0);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'preventOverflow',
        options: {
          padding: 10,
        },
      },
      {
        name: 'flip',
        options: {
          fallbackPlacements: [
            'top',
            'bottom-start',
            'bottom-end',
            'top-start',
            'top-end',
          ],
        },
      },
      {
        name: 'offset',
        options: {
          offset: [mouseOffset, 4],
        },
      },
    ],
  });

  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      if (!isHoveringTrigger.current && !isHoveringPopper.current) {
        setIsVisible(false);
      }
    }, 300);
  }, [clearHideTimeout]);

  // Global mouse tracking to detect hover over portal content
  useEffect(() => {
    if (!isVisible || !link || !hasLinkedWork(link)) return;

    const currentWorkId = link.split('/').pop();
    if (!currentWorkId) return;

    const handleGlobalMouseMove = (event: MouseEvent) => {
      // Find all elements with our portal ID
      const portalElements = document.querySelectorAll(
        `[data-portal-id="${currentWorkId}"]`
      );
      let isOverAnyPortal = false;

      portalElements.forEach(portalElement => {
        // Check if the portal element has rendered content
        const hasContent = portalElement.children.length > 0;
        if (hasContent) {
          const rect = portalElement.getBoundingClientRect();
          const isOverPortal =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;

          if (isOverPortal) {
            isOverAnyPortal = true;
          }
        }
      });

      if (isOverAnyPortal && !isHoveringPopper.current) {
        isHoveringPopper.current = true;
        clearHideTimeout();
      } else if (!isOverAnyPortal && isHoveringPopper.current) {
        isHoveringPopper.current = false;
        scheduleHide();
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isVisible, link, clearHideTimeout, scheduleHide]);

  const handleMouseEnter = useCallback(
    (event: ReactMouseEvent) => {
      isHoveringTrigger.current = true;
      clearHideTimeout();

      // Only calculate mouse offset if the card is not already visible
      if (!isVisible && referenceElement) {
        const linkRect = referenceElement.getBoundingClientRect();
        const linkCenter = linkRect.left + linkRect.width / 2;
        const rawOffset = event.clientX - linkCenter;

        const offsetX = Math.max(-200, Math.min(200, rawOffset));
        setMouseOffset(offsetX);
      }

      setIsVisible(true);
    },
    [clearHideTimeout, referenceElement, isVisible]
  );

  const handleMouseLeave = useCallback(() => {
    isHoveringTrigger.current = false;
    scheduleHide();
  }, [scheduleHide]);

  if (!(link && hasLinkedWork(link))) return null;

  const workId = link.split('/').pop();

  return (
    <WorkLinkWithIcon
      ref={setReferenceElement}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      href={link}
      data-component="featured-work-link"
      $isPortalVisible={isVisible}
      {...rest}
    >
      {children || 'View in catalogue'}
      <span
        aria-hidden="true"
        ref={setPopperElement}
        data-portal-id={workId}
        style={styles.popper}
        {...attributes.popper}
      />
    </WorkLinkWithIcon>
  );
};

export default FeaturedWorkLink;
export { hasLinkedWork };
