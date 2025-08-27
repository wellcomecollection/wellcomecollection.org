import { HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

import { useHoverPortal } from '@weco/common/hooks/useHoverPortal';

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
  const { portalRef, handleMouseEnter, mouseDirection } = useHoverPortal({
    portalWidth: 362,
    portalHeight: 96,
    defaultOffset: 4,
    downwardOffset: 26,
  });

  if (!(link && hasLinkedWork(link))) return null;

  const workId = link.split('/').pop();

  return (
    <WorkLinkWithIcon
      onMouseEnter={event => {
        handleMouseEnter(event);
        // You can still access mouseDirection here if needed
        console.log(`Mouse was moving: ${mouseDirection}`);
      }}
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
