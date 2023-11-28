import { grid } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';

export const EventsContainer = styled.div.attrs<{ $isDetailed?: boolean }>(
  props => ({
    className: props.$isDetailed
      ? ''
      : 'grid grid--scroll grid--theme-4 card-theme card-theme--transparent',
  })
)``;

export const EventWrapper = styled(Space).attrs<{
  $isDetailed?: boolean;
}>(props => ({
  $v: props.$isDetailed
    ? { size: 'xl', properties: ['padding-bottom'] }
    : undefined,
  className: props.$isDetailed ? 'grid' : grid({ s: 6, m: 6, l: 3, xl: 3 }),
}))`
  text-decoration: none;

  &:last-child {
    padding-bottom: 0;
  }

  &:hover {
    h3 {
      text-decoration: underline;
    }
  }
`;

export const ImageWrapper = styled.div.attrs<{ $isDetailed?: boolean }>(
  props => ({
    className: props.$isDetailed ? grid({ s: 12, m: 6, l: 4, xl: 4 }) : '',
  })
)`
  position: relative;
  margin-bottom: ${props => props.theme.spacingUnit * 2}px;
`;

export const Details = styled.div.attrs<{ $isDetailed?: boolean }>(props => ({
  className: props.$isDetailed ? grid({ s: 12, m: 6, l: 8, xl: 8 }) : '',
}))<{ $isDetailed?: boolean }>``;

export const DesktopLabel = styled(Space).attrs({
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  ${props => props.theme.media('medium', 'max-width')`
      display: none;
    `}
`;

export const MobileLabel = styled.div<{ $isDetailed?: boolean }>`
  position: absolute;
  bottom: 0;

  ${props =>
    props.$isDetailed
      ? `
        left: 18px;

        ${props.theme.media('medium')`
          display: none;
        `}
    `
      : ``}
`;
