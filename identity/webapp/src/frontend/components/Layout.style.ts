import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';

export const Container = styled(Space).attrs({
  v: { size: 'xl', properties: ['margin-bottom'] },
})`
  background-color: white;
  border: 1px solid #d9d6ce; // TODO use value from theme
  border-radius: 10px; // TODO use value from theme
  padding-top: 1em; // TODO use value from theme
`;

export const Wrapper = styled.div`
  padding: 1em;
`;

export const Header = styled(Space)`
background: ${props => props.theme.color('white')};
`;

export const Title = styled.h1.attrs({ className: 'font-wb font-size-0' })``;

export const Intro = styled(Space).attrs({
  as: 'p'
})`
  max-width: 66.6667%; // TODO add media queries
`;
