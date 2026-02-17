import React, {
  FunctionComponent,
  JSX,
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
  ScrollButtonsContainer,
  ScrollShim,
} from './ScrollContainer.styles';

type Props = PropsWithChildren<{
  hasDarkBackground?: boolean;
  gridSizes?: SizeMap;
  hasLeftOffset?: boolean;
  scrollButtonsAfter?: boolean;
  containerRef?: RefObject<HTMLUListElement | null>;
  CopyContent?: JSX.Element;
  useShim?: boolean;
}>;

const ScrollContainer: FunctionComponent<Props> = ({
  hasDarkBackground,
  gridSizes,
  hasLeftOffset,
  scrollButtonsAfter = false,
  containerRef,
  useShim = false,
  CopyContent,
  children,
}) => {
  const fallbackRef = useRef<HTMLUListElement>(null);
  const scrollContainerRef = containerRef || fallbackRef;

  const gridValues = gridSizes ? Object.values(gridSizes).map(v => v[0]) : [];

  const Copy = ({ addContainerWrapper }: { addContainerWrapper: boolean }) => {
    if (!CopyContent) return null;

    return (
      <ConditionalWrapper
        condition={!!gridSizes && addContainerWrapper}
        wrapper={children => (
          <ContaineredLayout gridSizes={gridSizes as SizeMap}>
            {children}
          </ContaineredLayout>
        )}
      >
        <div>{CopyContent}</div>
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
        $hasContent={!!CopyContent && !scrollButtonsAfter}
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
        condition={!scrollButtonsAfter || !!CopyContent}
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
