import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const WorkLinkWithIcon = styled.a<{ $portalRight: boolean }>`
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
    position: absolute;
    bottom: calc(100% + 5px);
    left: -10px;
    pointer-events: none;
    opacity: 0;
    z-index: 2;
    transition: opacity ${props => props.theme.transitionProperties};

    ${props =>
      props.$portalRight
        ? `
      right: -10px;
      left: auto;
      `
        : ''}
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
  const [portalRight, setPortalRight] = useState(false);

  useEffect(() => {
    // After the cards are portaled in to the data-portal-id element
    // we check that there's enough space for it. If not, we position it using
    // right instead of left. And we re-check this if the window is resized.
    const checkPosition = (element: HTMLElement) => {
      const viewportWidth = document.documentElement.clientWidth;
      const right = element.getBoundingClientRect().right;

      setPortalRight(right > viewportWidth);
    };

    const observer = new MutationObserver(([entry]) => {
      const insertedElement = entry.addedNodes[0] as HTMLElement;

      checkPosition(insertedElement);
    });

    const handleResize = () => {
      if (portalRef.current) {
        checkPosition(portalRef.current);
      }
    };

    if (portalRef.current) {
      observer.observe(portalRef.current, {
        childList: true,
      });
    }

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!(link && hasLinkedWork(link))) return null;

  const workId = link.split('/').pop();

  return (
    <WorkLinkWithIcon
      $portalRight={portalRight}
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
