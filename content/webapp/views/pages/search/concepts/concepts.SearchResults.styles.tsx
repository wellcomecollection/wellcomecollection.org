import NextLink from 'next/link';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

export const Link = styled(NextLink)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Wrapper = styled(Space).attrs({
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
})`
  display: block;
  text-decoration: none;
  color: inherit;

  &:hover,
  &:focus {
    h3 {
      text-decoration: underline;
      text-decoration-color: ${props => props.theme.color('black')};
    }
  }

  &:focus {
    outline: 3px solid ${props => props.theme.color('yellow')};
    outline-offset: 2px;
  }
`;

export const Details = styled.div`
  flex: 1 1 100%;

  ${props => props.theme.media('medium')`
    max-width: 900px;
  `}
`;

export const ConceptTitleHeading = styled.h3.attrs({
  className: font('sans-bold', 0),
})``;

export const ConceptDescription = styled(Space).attrs({
  className: font('sans', -1),
  $v: { size: '2xs', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('neutral.700')};
`;

export const AlternativeLabels = styled(Space).attrs({
  className: font('sans', -1),
  $v: { size: '2xs', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('neutral.600')};

  strong {
    font-weight: 600;
  }
`;

export const ConceptInformation = styled(Space).attrs({
  className: font('sans', -1),
  $v: { size: '2xs', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('neutral.600')};
`;

export const SearchResultUnorderedList = styled(PlainList)`
  display: flex;
  flex-wrap: wrap;
`;

export const SearchResultListItem = styled.li`
  flex-basis: 100%;
  max-width: 100%;

  &:first-child {
    border-top: 0;

    & > a {
      padding-top: 0;
    }
  }

  &:last-child a {
    padding-bottom: 0;
  }
`;
