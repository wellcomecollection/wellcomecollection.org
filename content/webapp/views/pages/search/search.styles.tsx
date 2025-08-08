import NextLink from 'next/link';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';

export const WorksLink = styled(NextLink).attrs({
  className: font('intr', 6),
})`
  border: 2px solid;
  padding: 4px 12px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const CatalogueResultsInner = styled(Space).attrs({
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  position: relative;
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

export const CatalogueResultsSection = styled(Space).attrs({
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})``;

export const CatalogueLinks = styled(Space).attrs({
  $v: { size: 'm', properties: ['margin-top', 'margin-bottom'] },
  className: 'is-hidden-s is-hidden-m',
})`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

export const ImageLinks = styled(Space).attrs({
  className: 'is-hidden-s is-hidden-m',
})<{ $isSmallGallery?: boolean }>`
  ${props => `margin-left: ${props.$isSmallGallery ? '16px' : '20px'}`};
  ${props => `margin-right: ${props.$isSmallGallery ? '16px' : '20px'}`};
`;

export const BasicSection = styled(Space).attrs({
  as: 'section',
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})``;

export const CatalogueSectionTitle = styled(Space).attrs<{
  $isSmallGallery?: boolean;
}>(props => ({
  as: 'h3',
  className: `${font('intsb', 4)} is-hidden-s is-hidden-m`,
  $v: props.$isSmallGallery
    ? { size: 'm', properties: ['margin-bottom'] }
    : undefined,
}))<{ $isSmallGallery?: boolean }>`
  ${props => !props.$isSmallGallery && `margin-bottom: 0;`}
`;

export const AllLink = styled(NextLink).attrs({
  className: font('intsb', 5),
})`
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  .icon {
    margin-left: 8px;
  }
`;

export const GridContainer = styled(Container)`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export const ContentResults = styled.div`
  grid-column: 1 / 13;

  ${props => props.theme.media('medium')`
    grid-column: 1 / 10;
  `}

  ${props => props.theme.media('large')`
    grid-row: 1;
    grid-column: 1 / 8;
  `}
`;

export const CatalogueResults = styled(Space).attrs({
  $v: { size: 'xl', properties: ['margin-bottom'] },
})<{ $fullWidth: boolean }>`
  grid-column: 1 / 13;

  ${props => props.theme.media('medium')`
    grid-column: 1 / 10;
  `}

  ${props =>
    props.theme.media('large')(`
      grid-column: ${props.$fullWidth ? '1' : '9'}/13;
    `)}
`;

export const LoaderContainer = styled.div<{ $fullWidth: boolean }>`
  grid-column: 6;

  ${props => props.theme.media('medium')`
    grid-column: 6;
  `}

  ${props =>
    props.theme.media('large')(
      `grid-column: ${props.$fullWidth ? '6' : '10'};`
    )}
`;
