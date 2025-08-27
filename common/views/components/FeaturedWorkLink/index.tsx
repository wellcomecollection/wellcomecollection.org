import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
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

  const [hoverPosition, setHoverPostion] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!portalRef.current) return;

    const portal = portalRef.current;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;

    // Default position: below the hover point with some offset
    let topPosition = hoverPosition.y + 10;
    // Center horizontally around the hover position
    const portalWidth = 362;
    let leftPosition = hoverPosition.x - portalWidth / 2;

    // Check if there's enough space below the hover point
    const portalHeight = 96;

    if (topPosition + portalHeight > viewportHeight) {
      // Not enough space below, position above the hover point
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
      onMouseEnter={event =>
        setHoverPostion({ x: event.clientX, y: event.clientY })
      }
      href={link}
      data-component="featured-work-link"
      data-gtm-id="work-link-component"
      {...rest}
    >
      {children || 'View in catalogue'}
      <span ref={portalRef} data-portal-id={workId} />
    </WorkLinkWithIcon>
  );
};

export default FeaturedWorkLink;
export { hasLinkedWork };
