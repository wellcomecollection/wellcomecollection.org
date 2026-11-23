import { FunctionComponent, RefObject, useEffect, useState } from 'react';
import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import useSwipeable, { SwipeDirection } from '@weco/content/hooks/useSwipeable';
import PrevNextLink from '@weco/content/views/components/PrevNextLink';

const ScrollButtonsContainer = styled(Space)<{
  $hasDarkBackground?: boolean;
  $hasLeftOffset?: boolean;
}>`
  display: flex;
  justify-content: flex-end;
  ${props => (props.$hasLeftOffset ? props.theme.pageGridOffset('left') : '')};

  /* Set CSS variables based on $hasDarkBackground */
  --button-color: ${props =>
    props.theme.color(props.$hasDarkBackground ? 'white' : 'black')};

  ${props => props.theme.makeSpacePropertyValues('sm', ['column-gap'])}
`;

type Props = {
  containerRef: RefObject<HTMLElement | null>;
  hasDarkBackground?: boolean;
  hasLeftOffset?: boolean;
};

const ScrollableNavigation: FunctionComponent<Props> = ({
  containerRef,
  hasDarkBackground,
  hasLeftOffset,
}: Props) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScrollButtons = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      // Determine whether each button should be enabled or disabled based on current scroll position
      setCanScrollLeft(container.scrollLeft > 0);
      // Button should be active only if there's more than 1 whole pixel remaining to scroll.
      setCanScrollRight(Math.floor(maxScrollLeft - container.scrollLeft) > 1);
    };

    updateScrollButtons();

    container.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      container.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  const scrollByChildImageWidth = (direction: SwipeDirection) => {
    const container = containerRef.current;
    if (!container) return;

    // Math.round is required because Chrome Android does not round numbers,
    // and this causes the scroll to not work correctly.
    const currScrollLeft = Math.round(container.scrollLeft);
    const children = Array.from(container.children) as HTMLElement[];
    const containerPaddingLeft = parseFloat(
      window.getComputedStyle(container).paddingLeft
    );

    const containerRect = container.getBoundingClientRect();
    const visibleWidth = containerRect.width;
    const visibleLeft = currScrollLeft + containerPaddingLeft;
    const visibleRight = currScrollLeft + visibleWidth;

    if (direction === 'right') {
      // Find the first item that's not fully visible on the right
      const targetChild = children.find(child => {
        const childRect = child.getBoundingClientRect();
        const childLeft = child.offsetLeft;
        const childRight = childLeft + childRect.width;

        // Item is not fully visible if it's cut off or completely hidden on the right
        return childRight > visibleRight;
      });

      if (!targetChild) return;

      const targetLeft = targetChild.offsetLeft;

      // Move the target item to the left edge, which will show it plus as many following items as possible
      const newScrollLeft = targetLeft - containerPaddingLeft;

      container.scrollTo({
        left: Math.max(0, newScrollLeft),
        behavior: 'smooth',
      });
    } else {
      // Find the first item that's not fully visible on the left
      const targetChild = children.findLast(child => {
        const childLeft = child.offsetLeft;

        // Item is not fully visible if it's cut off or completely hidden on the left
        return childLeft < visibleLeft;
      });

      if (!targetChild) return;

      const targetRect = targetChild.getBoundingClientRect();
      const targetLeft = targetChild.offsetLeft;
      const targetRight = targetLeft + targetRect.width;

      // Position so the target item is at the right edge, showing as many items to the left as possible
      const newScrollLeft = targetRight - visibleWidth;

      container.scrollTo({
        left: Math.max(0, newScrollLeft),
        behavior: 'smooth',
      });
    }
  };

  useSwipeable(containerRef, scrollByChildImageWidth);

  if (!canScrollLeft && !canScrollRight) return null;

  return (
    <ScrollButtonsContainer
      $hasDarkBackground={hasDarkBackground}
      $hasLeftOffset={hasLeftOffset}
    >
      <>
        <PrevNextLink
          direction="previous"
          label="Previous"
          isOnDark={hasDarkBackground}
          disabled={!canScrollLeft}
          onClick={() => scrollByChildImageWidth('left')}
          isStacked
        />
        <PrevNextLink
          direction="next"
          label="Next"
          isOnDark={hasDarkBackground}
          disabled={!canScrollRight}
          onClick={() => scrollByChildImageWidth('right')}
          isStacked
        />
      </>
    </ScrollButtonsContainer>
  );
};
export default ScrollableNavigation;
