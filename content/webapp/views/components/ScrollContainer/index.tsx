import { FunctionComponent, PropsWithChildren, useRef } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

import ScrollableNavigation from './ScrollContainer.Navigation';

const ScrollButtonsContainer = styled(Space).attrs({
  $v: { size: 'm', properties: ['margin-bottom'] },
})<{ $hasLabel?: boolean }>`
  display: flex;
  justify-content: ${props => (props.$hasLabel ? 'space-between' : 'flex-end')};
  gap: ${props => props.theme.spacingUnits['3']}px;
  align-items: center;
`;

const Label = styled(Space).attrs({
  className: font('intr', 6),
})<{ $hasDarkBackground?: boolean }>`
  color: ${props =>
    props.theme.color(props.$hasDarkBackground ? 'neutral.400' : 'black')};
`;

const ContentContainer = styled(PlainList)`
  display: flex;
  overflow: hidden;
  position: relative;
  padding: 3px 0;
`;

type Props = PropsWithChildren<{
  label?: string;
  hasDarkBackground?: boolean;
  gridSizes?: SizeMap;
  hasLeftOffset?: boolean;
  scrollButtonsAfter?: boolean;
  customScrollDistance?: number;
  containerRef?: React.RefObject<HTMLUListElement | null>;
}>;

const ScrollContainer: FunctionComponent<Props> = ({
  label,
  hasDarkBackground,
  gridSizes,
  hasLeftOffset,
  scrollButtonsAfter = false,
  customScrollDistance,
  containerRef,
  children,
}) => {
  const fallbackRef = useRef<HTMLUListElement>(null);
  const scrollContainerRef = containerRef || fallbackRef;

  const scrollButtons = (
    <ConditionalWrapper
      condition={!!gridSizes}
      wrapper={children => (
        <ContaineredLayout gridSizes={gridSizes as SizeMap}>
          {children}
        </ContaineredLayout>
      )}
    >
      <ScrollButtonsContainer $hasLabel={!!label}>
        {label && <Label $hasDarkBackground={hasDarkBackground}>{label}</Label>}

        <ScrollableNavigation
          containerRef={scrollContainerRef}
          hasDarkBackground={hasDarkBackground}
          hasLeftOffset={hasLeftOffset}
          customScrollDistance={customScrollDistance}
        />
      </ScrollButtonsContainer>
    </ConditionalWrapper>
  );

  return (
    <div data-component="scroll-container">
      {!scrollButtonsAfter && scrollButtons}
      <ContentContainer ref={scrollContainerRef}>{children}</ContentContainer>
      {scrollButtonsAfter && scrollButtons}
    </div>
  );
};

export default ScrollContainer;

export { ScrollableNavigation };
