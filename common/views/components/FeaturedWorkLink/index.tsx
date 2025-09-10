import {
  HTMLAttributes,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';

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
  const [referenceElement, setReferenceElement] =
    useState<HTMLAnchorElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLSpanElement | null>(
    null
  );
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
          offset: [0, 4],
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
      setIsVisible(false);
    }, 300);
  }, [clearHideTimeout]);

  const handleMouseEnter = useCallback(() => {
    clearHideTimeout();
    setIsVisible(true);
  }, [clearHideTimeout]);

  const handleMouseLeave = useCallback(() => {
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
      data-gtm-id="work-link-component"
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
