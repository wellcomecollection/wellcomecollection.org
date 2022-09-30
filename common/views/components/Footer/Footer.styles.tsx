import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';

export const Wrapper = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top'] },
})`
  position: relative;
  background-color: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
`;

export const FooterNavWrapper = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
  },
})`
  border-top: 1px solid ${props => props.theme.color('neutral.700')};
  border-bottom: 1px solid ${props => props.theme.color('neutral.700')};
`;

export const FooterUsefulInformation = styled(Space).attrs({
  className: font('intr', 5),
  v: { size: 'l', properties: ['padding-bottom'] },
})`
  display: flex;
  flex-direction: column;

  ${props => props.theme.media('medium')`
    flex-direction: row;
  `}
`;

export const FooterOpeningTimes = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-bottom'] },
})`
  flex: 1 1 30%;
`;

export const FooterBottom = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-bottom'] },
})`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  border-top: 1px solid ${props => props.theme.color('neutral.700')};
`;

export const NavBrand = styled.a`
  position: absolute;
  bottom: 0;
  display: block;
`;

export const FooterLeft = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;

  ${props => props.theme.media('medium')`
      flex-wrap: nowrap;
    `}
`;

export const FooterStrap = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['margin-top', 'padding-bottom', 'margin-bottom'],
  },
})`
  display: flex;
  align-items: center;
  min-width: 220px;
  border-bottom: 1px solid ${props => props.theme.color('neutral.700')};
  width: 100%;

  ${props =>
    props.theme.media('medium')(`
      width: auto;
      border-bottom: 0;
      border-right: 1px solid ${props.theme.color('neutral.700')};
      margin-right: 24px;
      padding-right: 24px;
    `)}
`;

export const StrapText = styled.div`
  max-width: 10rem;
`;

export const HygieneNav = styled(Space).attrs({
  as: 'nav',
  h: { size: 'l', properties: ['padding-bottom'] },
})`
  position: relative;
`;

export const HygieneList = styled(Space).attrs({
  as: 'ul',
  h: { size: 'l', properties: ['padding-top'] },
})`
  display: flex;
  list-style: none;
  margin: 0;
  padding-left: 0;
  border-top: 1px solid ${props => props.theme.color('neutral.700')};
`;

export const HygieneItem = styled.li.attrs({
  className: font('intr', 5),
})`
  margin-right: 3rem;

  &:last-child {
    margin-right: 0;
  }
`;

export const TopBorderBox = styled.div`
  @media (min-width: ${props => props.theme.sizes.large}px) {
    border-top: 1px solid ${props => props.theme.color('neutral.700')};
    border-bottom: 0;
  }
`;
