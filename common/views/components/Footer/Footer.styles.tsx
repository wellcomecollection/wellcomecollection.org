import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';

export const Wrapper = styled(Space).attrs({
  className: font('intr', 5),
  v: { size: 'xl', properties: ['padding-top'] },
})`
  position: relative;
  background-color: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
`;

export const FooterBasicSection = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-bottom'] },
})``;

/** ************************ */
// START OF FOOTER BODY STYLES
/** ************************ */
export const FooterNavigationContainer = styled(FooterBasicSection)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

// TODO mismatched links, what do
export const FindUsContainer = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-bottom'] },
})`
  flex: 1 1 100%;

  ${props => props.theme.media('medium')`
      flex: 1 1 50%;
      `}

  ${props => props.theme.media('large')`
      flex: 1 1 20%;
      margin-right: 2rem;
    `}
  
    .plain-link {
    transition: color 200ms ease;

    &:hover,
    &:focus {
      color: ${props => props.theme.color('accent.lightGreen')};
    }
  }
`;

export const OpeningTimesContainer = styled(FooterBasicSection)`
  flex: 1 1 100%;

  ${props => props.theme.media('medium')`
    flex: 1 1 50%;
    `}

  ${props => props.theme.media('large')`
    flex: 1 1 30%;
    margin-right: 2rem;
  `}
`;

export const InternalNavigationContainer = styled(FooterBasicSection)`
  flex: 1 1 50%;

  ${props => props.theme.media('medium')`
    flex: 1 1 30%;
`}
`;

export const FullWidthDivider = styled(Space).attrs({
  className: 'is-hidden-s is-hidden-m',
})`
  flex: 1 1 100%;
`;

export const PoliciesContainer = styled(Space)`
  flex: 1 1 30%;

  ${props => props.theme.media('medium')`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  `}

  ${props => props.theme.media('large')`
    margin-top: 1rem;
    `}
`;

export const SocialsContainer = styled(Space)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 1 100%;
  margin: 1rem 0;

  ${props => props.theme.media('medium')`
    flex: 0 1 auto;
    align-self: flex-start;
    margin: 0;
  `}

  ${props => props.theme.media('large')`
    margin-top: 1rem;
    `}
`;
/** ********************** */
// END OF FOOTER BODY STYLES
/** ********************** */

export const FooterBottom = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-bottom'] },
})`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  line-height: 1;
`;

export const FooterLicense = styled.p.attrs({ className: font('intr', 6) })`
  display: inline;
  margin: 0 1rem 1rem 0;
`;
