import { FunctionComponent, RefObject, useEffect, useState } from 'react';
import styled from 'styled-components';

import { arrowSmall } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import useSwipeable, {
  SwipeDirection,
} from '@weco/content/components/CatalogueImageGallery/useSwipeable';

const ScrollButton = styled('button').attrs({
  className: font('intr', 6),
})`
  color: ${props => props.theme.color('white')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:disabled {
    color: ${props => props.theme.color('neutral.500')};
  }
`;

const ScrollButtonsContainer = styled(Space)`
  display: flex;
  justify-content: flex-end;
`;

type Props = {
  targetRef: RefObject<HTMLElement | null>;
};

const ScrollableGalleryButtons: FunctionComponent<Props> = ({
  targetRef,
}: Props) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const getMaxScrollLeft = () => {
    if (!targetRef.current) return 0;

    const { scrollWidth, clientWidth } = targetRef.current;
    return scrollWidth - clientWidth;
  };

  const updateScrollButtons = () => {
    if (!targetRef.current) return;

    const { scrollLeft } = targetRef.current;
    const maxScrollLeft = getMaxScrollLeft();

    // Determine whether each button should be enabled or disabled based on current scroll position
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(Math.ceil(scrollLeft) < maxScrollLeft);
  };

  useEffect(() => {
    if (!targetRef.current) return;
    updateScrollButtons();

    targetRef.current.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      targetRef.current?.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  });

  const scrollByChildImageWidth = (direction: SwipeDirection) => {
    if (!targetRef.current) return;

    const currScrollLeft = targetRef.current.scrollLeft;
    const containerPadding = parseFloat(
      window.getComputedStyle(targetRef.current).paddingLeft
    );

    const children = Array.from(targetRef.current.children) as HTMLElement[];

    // When scrolling right, scroll to the first child whose left offset is higher than the current left scroll.
    // Otherwise, scroll to the last child chose left offset is lower than the current left scroll.
    const child =
      direction === 'right'
        ? children.find(
            child => child.offsetLeft > currScrollLeft + containerPadding
          )
        : children.findLast(
            child => child.offsetLeft < currScrollLeft + containerPadding
          );

    if (!child) return;

    targetRef.current.scrollTo({
      left: child.offsetLeft - containerPadding,
      behavior: 'smooth',
    });
  };

  useSwipeable(targetRef, scrollByChildImageWidth);

  if (!canScrollLeft && !canScrollRight) {
    return null;
  }

  return (
    <ScrollButtonsContainer>
      <ScrollButton
        disabled={!canScrollLeft}
        onClick={() => scrollByChildImageWidth('left')}
      >
        <Icon icon={arrowSmall} rotate={180} />
        Prev
      </ScrollButton>
      <ScrollButton
        disabled={!canScrollRight}
        onClick={() => scrollByChildImageWidth('right')}
      >
        <Icon icon={arrowSmall} />
        Next
      </ScrollButton>
    </ScrollButtonsContainer>
  );
};
export default ScrollableGalleryButtons;
