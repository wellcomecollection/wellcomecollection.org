import React, {
  FunctionComponent,
  PropsWithChildren,
  RefObject,
  useRef,
} from 'react';

import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';

import ScrollableNavigation from './ScrollContainer.Navigation';
import {
  ContentContainer,
  Description,
  DetailsCopy,
  ScrollButtonsContainer,
  ScrollShim,
} from './ScrollContainer.styles';

type Props = PropsWithChildren<{
  detailsCopy?: string;
  description?: string;
  hasDarkBackground?: boolean;
  gridSizes?: SizeMap;
  hasLeftOffset?: boolean;
  scrollButtonsAfter?: boolean;
  containerRef?: RefObject<HTMLUListElement | null>;
  useShim?: boolean;
}>;

const ScrollContainer: FunctionComponent<Props> = ({
  detailsCopy,
  description,
  hasDarkBackground,
  gridSizes,
  hasLeftOffset,
  scrollButtonsAfter = false,
  containerRef,
  useShim = false,
  children,
}) => {
  const fallbackRef = useRef<HTMLUListElement>(null);
  const scrollContainerRef = containerRef || fallbackRef;

  const gridValues = gridSizes ? Object.values(gridSizes).map(v => v[0]) : [];

  const Copy = ({ addContainerWrapper }: { addContainerWrapper: boolean }) => {
    if (!detailsCopy && !description) return null;

    return (
      <ConditionalWrapper
        condition={!!gridSizes && addContainerWrapper}
        wrapper={children => (
          <ContaineredLayout gridSizes={gridSizes as SizeMap}>
            {children}
          </ContaineredLayout>
        )}
      >
        <div>
          {description && (
            <Description $hasDarkBackground={hasDarkBackground}>
              {description}
            </Description>
          )}
          {detailsCopy && (
            <DetailsCopy $hasDarkBackground={hasDarkBackground}>
              {detailsCopy}
            </DetailsCopy>
          )}
        </div>
      </ConditionalWrapper>
    );
  };

  const ScrollButtons = () => (
    <ConditionalWrapper
      condition={!!gridSizes}
      wrapper={children => (
        <ContaineredLayout gridSizes={gridSizes as SizeMap}>
          {children}
        </ContaineredLayout>
      )}
    >
      <ScrollButtonsContainer
        $hasContent={(!!detailsCopy || !!description) && !scrollButtonsAfter}
        $scrollButtonsAfter={scrollButtonsAfter}
      >
        {!scrollButtonsAfter && <Copy addContainerWrapper={false} />}

        <ScrollableNavigation
          containerRef={scrollContainerRef}
          hasDarkBackground={hasDarkBackground}
          hasLeftOffset={hasLeftOffset}
        />
      </ScrollButtonsContainer>
    </ConditionalWrapper>
  );

  return (
    <div data-component="scroll-container">
      <ConditionalWrapper
        condition={!scrollButtonsAfter || !!detailsCopy || !!description}
        wrapper={children => (
          <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
            {children}
          </Space>
        )}
      >
        {!scrollButtonsAfter ? <ScrollButtons /> : <Copy addContainerWrapper />}
      </ConditionalWrapper>

      <ContentContainer ref={scrollContainerRef}>
        {useShim && gridSizes && <ScrollShim $gridValues={gridValues} />}
        {children}
      </ContentContainer>

      {scrollButtonsAfter && <ScrollButtons />}
    </div>
  );
};

export default ScrollContainer;

export { ScrollableNavigation };
