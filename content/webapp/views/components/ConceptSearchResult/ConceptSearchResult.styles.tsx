import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Wrapper = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
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
  className: font('intb', 4),
})`
  margin-bottom: 0.5rem;
  color: ${props => props.theme.color('black')};
`;

export const ConceptDescription = styled(Space).attrs({
  className: font('intr', 5),
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('neutral.700')};
  line-height: 1.4;
`;

export const AlternativeLabels = styled(Space).attrs({
  className: font('intr', 5),
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('neutral.600')};

  strong {
    font-weight: 600;
  }
`;

export const ConceptInformation = styled(Space).attrs({
  className: font('intr', 5),
  $v: { size: 'xs', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('neutral.600')};

  .searchable-selector {
    font-weight: 500;
  }
`;
