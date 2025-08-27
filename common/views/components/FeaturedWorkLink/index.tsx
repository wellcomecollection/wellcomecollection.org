import {
  HTMLAttributes,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

const WorkLinkWithIcon = styled.a`
  text-decoration-style: dotted;
  text-underline-offset: 26%;
  text-decoration-thickness: 8%;
  position: relative;

  &::before {
    content: '';
    position: relative;

    background-image: url('https://i.wellcomecollection.org/assets/icons/favicon-32x32.png');
    background-repeat: no-repeat;
    background-size: 14px; /* 14px is the smallest size it should be and we want them all to be the same */
    background-position: center;
    padding-right: 18px;
  }

  [data-portal-id] {
    position: fixed;
    pointer-events: none;
    z-index: 2;
    opacity: 0;
    transition: opacity ${props => props.theme.transitionProperties};
  }

  &:hover {
    [data-portal-id] {
      opacity: 1;
    }
  }

  ${props =>
    props.theme.mediaBetween(
      'small',
      'medium'
    )(`
    [data-portal-id] {
      display: none;
    }
  `)}
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
  const portalRef = useRef<HTMLSpanElement>(null);
  const previousMousePosition = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const mouseDirection = useRef<'up' | 'down' | 'none'>('none');

  const [hoverPosition, setHoverPostion] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const id = useId();

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

  useEffect(() => {
    if (!portalRef.current) return;

    const portal = portalRef.current;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;

    // Default position: below the hover point with some offset
    // Increase offset when mouse was moving down
    const baseOffset = mouseDirection.current === 'down' ? 26 : 4;
    let topPosition = hoverPosition.y + baseOffset;
    // Center horizontally around the hover position
    const portalWidth = 362;
    let leftPosition = hoverPosition.x - portalWidth / 2;

    // Check if there's enough space below the hover point
    const portalHeight = 96;

    // Check if the portal would go below the viewport with the calculated position
    if (topPosition + portalHeight > viewportHeight) {
      // Not enough space below, position above the hover point regardless of direction
      topPosition = hoverPosition.y - portalHeight - 10;
    }

    // Ensure the portal doesn't go off the left or right edge
    if (leftPosition + portalWidth > viewportWidth) {
      leftPosition = viewportWidth - portalWidth - 10;
    }

    if (leftPosition < 10) {
      leftPosition = 10;
    }

    portal.style.top = `${Math.max(10, topPosition)}px`;
    portal.style.left = `${leftPosition}px`;
  }, [hoverPosition]);

  if (!(link && hasLinkedWork(link))) return null;

  const workId = link.split('/').pop();

  return (
    <WorkLinkWithIcon
      onMouseEnter={event => {
        setHoverPostion({ x: event.clientX, y: event.clientY });
        // You can access mouseDirection.current here to know the direction
        console.log(`Mouse was moving: ${mouseDirection.current}`);
      }}
      href={link}
      data-component="featured-work-link"
      data-gtm-id="work-link-component"
      {...rest}
    >
      {children || 'View in catalogue'}
      <span id={id} ref={portalRef} data-portal-id={workId} />
    </WorkLinkWithIcon>
  );
};

export default FeaturedWorkLink;
export { hasLinkedWork };
