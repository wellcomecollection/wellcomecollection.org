import { useEffect, useState } from 'react';
import styled from 'styled-components';

import Icon from '@weco/common/views/components/Icon';
import { arrowSmall } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

const ScrollButton = styled('button').attrs({
  className: font('intr', 6),
})`
  color: white;
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

const ScrollableGalleryButtons = ({ targetRef }) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const getMaxScrollLeft = () => {
    const { scrollWidth, clientWidth } = targetRef.current;
    return scrollWidth - clientWidth;
  };

  const updateScrollButtons = () => {
    if (!targetRef.current) return;

    const { scrollLeft } = targetRef.current;
    const maxScrollLeft = getMaxScrollLeft();

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(Math.ceil(scrollLeft) < maxScrollLeft);
  };

  useEffect(() => {
    if (!targetRef.current) return;
    updateScrollButtons();

    targetRef.current.addEventListener('scroll', updateScrollButtons);
    return () => {
      targetRef.current?.removeEventListener('scroll', updateScrollButtons);
    };
  });

  const scrollByChildImageWidth = direction => {
    const currScrollLeft = targetRef.current.scrollLeft;
    const children: HTMLElement[] = Array.from(targetRef.current.children);

    // When scrolling right, scroll to the first child whose left offset is higher than the current left scroll.
    // Otherwise, scroll to the last child chose left offset is lower than the current left scroll.
    const child =
      direction === 'right'
        ? children.find(child => child.offsetLeft > currScrollLeft)
        : children.findLast(child => child.offsetLeft < currScrollLeft);

    if (!child) return;

    targetRef.current.scrollTo({
      left: child.offsetLeft,
      behavior: 'smooth',
    });
  };

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
