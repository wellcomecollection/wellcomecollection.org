import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const Container = styled.div`
  ${props => props.theme.media('medium')`
    display: flex;
  `}
`;

export const Wrapper = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  display: block;

  text-decoration: none;

  &:hover,
  &:focus {
    h3 {
      text-decoration: underline;
      text-decoration-color: ${props => props.theme.color('black')};
    }
  }
`;

export const Preview = styled(Space)`
  display: flex;
  flex: 1 1 100%;
  justify-content: center;
  align-items: center;
  height: 120px;
  width: 120px;
  max-width: 120px;
  margin-bottom: ${props => props.theme.spacingUnit * 2}px;
  margin-right: 1rem;
  background-color: ${props => props.theme.color('black')};

  ${props => props.theme.media('medium')`
    margin-bottom: 0;
  `}
`;

export const PreviewImage = styled.img`
  max-width: calc(100% - 10px);
  max-height: calc(100% - 10px);
  width: auto;
  height: auto;
`;

export const Details = styled.div`
  flex: 1 1 100%;

  ${props => props.theme.media('medium')`
    max-width: 900px;
  `}
`;

export const WorkInformation = styled(Space).attrs({
  className: font('sans', -1),
  $v: { size: 'xs', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('neutral.600')};
`;

// using the adjacent sibling combinator along with parent selector
// to create this thing that applies only if it is the immediate
// sibling after `searchable-selector`
export const WorkInformationItemSeparator = styled.span`
  display: none;

  .searchable-selector + & {
    display: inline-block;
    margin: 0 4px;
  }
`;

export const WorkTitleHeading = styled.h3.attrs({
  className: font('sans-bold', 0),
})`
  margin-bottom: 0.5rem;
`;
