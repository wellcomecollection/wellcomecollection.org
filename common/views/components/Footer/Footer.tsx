import { useRef, useEffect, FunctionComponent } from 'react';

// Components
import Space from '@weco/common/views/components/styled/Space';
import FooterWellcomeLogo from './FooterWellcomeLogo';
import FindUs from '../FindUs/FindUs';
// import FooterOpeningTimes from './FooterOpeningTimes';
import OpeningTimes from '@weco/common/views/components/OpeningTimes/OpeningTimes';
import FooterNav from './FooterNav';
import FooterSocial from './FooterSocial';
import Divider from '@weco/common/views/components/Divider/Divider';
import styled from 'styled-components';

// Utils / Types
import { font } from '@weco/common/utils/classnames';
import { Venue } from '@weco/common/model/opening-hours';

type Props = {
  hide: boolean;
  venues: Venue[];
};

// Styles
const Wrapper = styled(Space).attrs({
  className: font('intr', 5),
  v: { size: 'xl', properties: ['padding-top'] },
})`
  position: relative;
  background-color: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
`;

const FooterBasicSection = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-bottom'] },
})``;

/** ************************ */
// START OF FOOTER BODY STYLES
/** ************************ */

const FooterNavigationContainer = styled(FooterBasicSection)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

// TODO mismatched links, what do

const FindUsContainer = styled(Space).attrs({
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

const OpeningTimesContainer = styled(FooterBasicSection)`
  flex: 1 1 100%;

  ${props => props.theme.media('medium')`
    flex: 1 1 50%;
    `}

  ${props => props.theme.media('large')`
    flex: 1 1 30%;
    margin-right: 2rem;
  `}
`;

const InternalNavigationContainer = styled(FooterBasicSection)`
  flex: 1 1 50%;

  ${props => props.theme.media('medium')`
    flex: 1 1 30%;
`}
`;

const FullWidthDivider = styled(Space).attrs({
  className: 'is-hidden-s is-hidden-m',
})`
  flex: 1 1 100%;
`;

const PoliciesContainer = styled(Space)`
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

const SocialsContainer = styled(Space)`
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

const FooterBottom = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-bottom'] },
})`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  line-height: 1;
`;

const FooterLicense = styled.p.attrs({ className: font('intr', 6) })`
  display: inline;
  margin: 0 1rem 1rem 0;
`;

// Component
const Footer: FunctionComponent<Props> = ({ venues, hide = false }: Props) => {
  const footer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hide && footer && footer.current) {
      footer.current.classList.add('is-hidden');
    }
  }, []);

  return (
    <Wrapper ref={footer}>
      <div className="container">
        <FooterBasicSection as="h3">
          <FooterWellcomeLogo />
        </FooterBasicSection>

        <FooterNavigationContainer>
          <FindUsContainer>
            <FindUs />
          </FindUsContainer>

          <OpeningTimesContainer>
            <h4 className={font('intb', 5)}>{`Today's opening times`}</h4>
            {venues && <OpeningTimes venues={venues} />}
            <Space as="p" v={{ size: 'm', properties: ['margin-top'] }}>
              <a href="/opening-times">Opening times</a>
            </Space>
          </OpeningTimesContainer>

          <InternalNavigationContainer>
            <FooterNav items="InternalNavigation" />
          </InternalNavigationContainer>

          <FullWidthDivider>
            <Divider color="neutral.700" isKeyline />
          </FullWidthDivider>

          <PoliciesContainer>
            <FooterNav isInline items="PoliciesNavigation" />
          </PoliciesContainer>

          <SocialsContainer>
            <FooterSocial />
          </SocialsContainer>
        </FooterNavigationContainer>

        <FooterBottom>
          <FooterLicense>
            Except where otherwise noted, content on this site is licensed under
            a{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/">
              Creative Commons Attribution 4.0 International Licence
            </a>
          </FooterLicense>

          <a href="#top" className="is-hidden-s">
            Back to top
          </a>
        </FooterBottom>
      </div>
    </Wrapper>
  );
};

export default Footer;
