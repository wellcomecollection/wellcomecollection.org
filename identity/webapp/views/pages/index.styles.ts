import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';

export const ProgressBar = styled(Space).attrs({
  $v: { size: 'sm', properties: ['margin-bottom'] },
})`
  background-color: ${props => props.theme.color('white')};
  border-radius: 7px; /* (height of inner div) / 2 + padding */
  border: 2px solid black;
  width: 300px;
  max-width: 100%;
`;

export const ProgressIndicator = styled.div<{ $percentage: number }>`
  background-color: ${props => props.theme.color('black')};
  width: ${props => `${props.$percentage}%`};
  height: 10px;
`;

export const ButtonWrapper = styled(Space).attrs({
  as: 'span',
  $v: { size: 'md', properties: ['margin-bottom'] },
  $h: { size: 'md', properties: ['margin-right'] },
})`
  display: inline-block;
`;

export const ItemTitle = styled.span`
  display: inline-block;
  min-width: 300px;
  max-width: 600px;

  ${props => props.theme.media('large', 'max-width')`
    min-width: 100%;
  `}
`;

export const ItemStatus = styled.span`
  white-space: nowrap;
`;

export const ItemPickup = styled.span`
  white-space: nowrap;
`;

export const StyledDl = styled(Space).attrs({
  as: 'dl',
  $v: { size: 'md', properties: ['margin-bottom'] },
})`
  margin-top: 0;
`;

export const StyledDd = styled(Space).attrs({
  as: 'dd',
  $v: { size: 'sm', properties: ['margin-bottom'] },
})`
  margin-left: 0;
`;
