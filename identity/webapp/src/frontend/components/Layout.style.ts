import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { grid } from '@weco/common/utils/classnames';

export const Container = styled(Space).attrs({
  v: { size: 'xl', properties: ['margin-bottom'] },
})`
  background-color: white;
  border: 1px solid ${props => props.theme.color('pumice')};
  border-radius: 10px;
`;

export const Wrapper = styled.div`
  padding: 1em;
`;

export const Header = styled(Space)`
  background: ${props => props.theme.color('white')};
`;

export const Title = styled.h1.attrs({ className: 'font-wb font-size-0' })``;

export const Intro = styled(Space).attrs({
  as: 'p',
  className: grid({ s: 12, m: 12, l: 8, xl: 8 }),
})`
  padding-left: 0;
`;
