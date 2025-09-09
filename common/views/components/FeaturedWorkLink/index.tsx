import { HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

import { useHoverPortal } from '@weco/common/hooks/useHoverPortal';

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

    background-image: url('https://i.wellcomecollection.org/assets/icons/favicon-32x32.png');
    background-repeat: no-repeat;
    background-size: 14px; /* 14px is the smallest size it should be and we want them all to be the same */
    background-position: center;
    padding-right: 18px;
  }

  [data-portal-id] {
    position: fixed;
    z-index: ${props => (props.$isPortalVisible ? '2' : '-1')};
    opacity: ${props => (props.$isPortalVisible ? '1' : '0')};
    transition: opacity ${props => props.theme.transitionProperties};

    ${props =>
      props.theme.mediaBetween(
        'small',
        'medium'
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
  const {
    portalRef,
    triggerRef,
    isVisible,
    handleTriggerMouseEnter,
    handleTriggerMouseLeave,
  } = useHoverPortal({
    portalWidth: 362,
    portalHeight: 96,
    defaultOffset: 4,
  });

  if (!(link && hasLinkedWork(link))) return null;

  const workId = link.split('/').pop();

  return (
    <WorkLinkWithIcon
      ref={triggerRef}
      onMouseEnter={handleTriggerMouseEnter}
      onMouseLeave={handleTriggerMouseLeave}
      href={link}
      data-component="featured-work-link"
      data-gtm-id="work-link-component"
      $isPortalVisible={isVisible}
      {...rest}
    >
      {children || 'View in catalogue'}
      <span aria-hidden="true" ref={portalRef} data-portal-id={workId} />
    </WorkLinkWithIcon>
  );
};

export default FeaturedWorkLink;
export { hasLinkedWork };
