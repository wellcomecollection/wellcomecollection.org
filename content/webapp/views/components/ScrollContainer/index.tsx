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
})`
  display: flex;
  justify-content: space-between;
  gap: ${props => props.theme.spacingUnits['3']}px;
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
}>;

const ScrollContainer: FunctionComponent<Props> = ({
  label,
  hasDarkBackground,
  gridSizes,
  hasLeftOffset,
  children,
}) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  return (
    <div data-component="scroll-container">
      <ConditionalWrapper
        condition={!!gridSizes}
        wrapper={children => (
          <ContaineredLayout gridSizes={gridSizes as SizeMap}>
            {children}
          </ContaineredLayout>
        )}
      >
        <ScrollButtonsContainer>
          {label && (
            <Label $hasDarkBackground={hasDarkBackground}>{label}</Label>
          )}

          <ScrollableNavigation
            containerRef={scrollContainerRef}
            hasDarkBackground={hasDarkBackground}
            hasLeftOffset={hasLeftOffset}
          />
        </ScrollButtonsContainer>
      </ConditionalWrapper>

      <ContentContainer ref={scrollContainerRef}>{children}</ContentContainer>
    </div>
  );
};

export default ScrollContainer;

export { ScrollableNavigation };
