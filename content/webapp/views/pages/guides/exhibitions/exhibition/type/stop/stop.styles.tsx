import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';

export const Page = styled.div`
  background-color: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
  min-height: 100vh;
`;

export const FlushContainer = styled(Container)`
  ${props =>
    props.theme.mediaBetween(
      'small',
      'medium'
    )(`
        padding: 0;
    `)}
`;

export const Header = styled.header.attrs({
  className: font('intr', -1),
})`
  background-color: ${props => props.theme.color('neutral.700')};
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const Title = styled.h1.attrs({
  className: font('intb', -1),
})`
  margin-bottom: 0;
`;

export const HeaderInner = styled(Space).attrs({
  $v: {
    size: 's',
    properties: ['padding-top', 'padding-bottom'],
  },
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const prevNextHeight = '50px';

export const PrevNext = styled.div.attrs({
  className: font('intr', -1),
})`
  position: fixed;
  z-index: 2;
  bottom: 0;
  width: 100%;
  height: ${prevNextHeight};
  background: ${props => props.theme.color('neutral.700')};
`;

export const AudioPlayerNewWrapper = styled.div`
  position: fixed;
  bottom: ${prevNextHeight};
  width: 100%;
`;

export const AlignCenter = styled.div`
  display: flex;
  align-items: center;
`;

export const StickyPlayer = styled.div<{ $sticky: boolean }>`
  position: ${props => (props.$sticky ? 'sticky' : undefined)};

  margin-left: -${props => props.theme.gutter.small}px;
  margin-right: -${props => props.theme.gutter.small}px;

  ${props => props.theme.media('medium')`
    margin-left: 0;
    margin-right: 0;
  `}

  /* Fallback to 60px if there's no js */
  top: var(--stop-header-height, 60px);
  z-index: 1;
`;
