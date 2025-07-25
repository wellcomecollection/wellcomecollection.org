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
})<{ $isDarkMode?: boolean }>`
  color: ${props =>
    props.theme.color(props.$isDarkMode ? 'neutral.400' : 'black')};
`;

const ContentContainer = styled(PlainList)`
  display: flex;
  overflow: hidden;
  position: relative;
  padding: 3px 0;
`;

type Props = PropsWithChildren<{
  label?: string;
  isDarkMode?: boolean;
  gridSizes?: SizeMap;
  hasLeftOffset?: boolean;
}>;

const ScrollContainer: FunctionComponent<Props> = ({
  label,
  isDarkMode,
  gridSizes,
  hasLeftOffset,
  children,
}) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  return (
    <>
      <ConditionalWrapper
        condition={!!gridSizes}
        wrapper={children => (
          <ContaineredLayout gridSizes={gridSizes as SizeMap}>
            {children}
          </ContaineredLayout>
        )}
      >
        <ScrollButtonsContainer>
          {label && <Label $isDarkMode={isDarkMode}>{label}</Label>}

          <ScrollableNavigation
            containerRef={scrollContainerRef}
            isDarkMode={isDarkMode}
            hasLeftOffset={hasLeftOffset}
          />
        </ScrollButtonsContainer>
      </ConditionalWrapper>

      <ContentContainer ref={scrollContainerRef}>{children}</ContentContainer>
    </>
  );
};

export default ScrollContainer;

export { ScrollableNavigation };
