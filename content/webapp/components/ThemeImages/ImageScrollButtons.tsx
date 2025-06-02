import { useEffect, useState } from 'react';
import styled from 'styled-components';

import Icon from '@weco/common/views/components/Icon';
import { arrow } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

const ScrollButton = styled('button').attrs({
  className: font('intr', 6, { small: 1, medium: 1, large: 1 }),
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
    position: absolute;
    top: 0;
    right: 0
`;

const ImageScrollButtons = ({ targetRef }) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [leftmostVisibleChildIndex, setLeftmostVisibleChildIndex] = useState(0);

  const updateScrollButtons = () => {
    if (!targetRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = targetRef.current;
    const maxScrollLeft = scrollWidth - clientWidth;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < maxScrollLeft);
  };

  useEffect(() => {
    if (!targetRef.current) return;
    updateScrollButtons();

    targetRef.current.addEventListener('scroll', updateScrollButtons);
    return () => {
      targetRef.current.removeEventListener('scroll', updateScrollButtons);
    };
  });

  const scrollByChildImageWidth = direction => {
    // When scrolling right, the amount we scroll by is determined by the width of the leftmost visible image.
    // When scrolling left, it's determined by the width of the image to its left.
    const index =
      direction === 'right'
        ? leftmostVisibleChildIndex
        : leftmostVisibleChildIndex - 1;
    const child = targetRef.current.children[index];
    if (!child) return;

    const width = child.getBoundingClientRect().width;
    const multiplier = direction === 'right' ? 1 : -1;
    targetRef.current.scrollBy({
      left: multiplier * width,
      behavior: 'smooth',
    });

    setLeftmostVisibleChildIndex(leftmostVisibleChildIndex + multiplier);
  };

  if(!canScrollLeft && !canScrollRight) {
    return null;
  }

  return (
    <ScrollButtonsContainer>
      <ScrollButton
        disabled={!canScrollLeft}
        onClick={() => scrollByChildImageWidth('left')}
      >
        <Icon icon={arrow} rotate={180} />
        Prev
      </ScrollButton>
      <ScrollButton
        disabled={!canScrollRight}
        onClick={() => scrollByChildImageWidth('right')}
      >
        <Icon icon={arrow} />
        Next
      </ScrollButton>
    </ScrollButtonsContainer>
  );
};
export default ImageScrollButtons;
