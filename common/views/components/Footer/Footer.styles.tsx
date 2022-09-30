import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';

export const Wrapper = styled(Space).attrs({
  className: font('intr', 5),
  v: { size: 'l', properties: ['padding-top'] },
})`
  position: relative;
  background-color: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
`;

export const FooterUsefulInformation = styled(Space).attrs({
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
  h: { size: 'l', properties: ['padding-bottom', 'padding-top'] },
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1;
`;

export const FooterLicense = styled.p.attrs({ className: font('intr', 6) })`
  display: inline;
  margin: 0;
`;
