import { useRef, FunctionComponent } from 'react';
import styled from 'styled-components';

// Components
import Space from '@weco/common/views/components/styled/Space';
import OpeningTimes from '@weco/common/views/components/OpeningTimes/OpeningTimes';
import Divider from '@weco/common/views/components/Divider/Divider';
import FindUs from '../FindUs/FindUs';
import FooterNav from './Footer.Nav';
import FooterSocial from './Footer.Social';
import FooterWellcomeLogo from './Footer.WellcomeLogo';

// Utils / Types
import { font } from '@weco/common/utils/classnames';
import { Venue } from '@weco/common/model/opening-hours';

type Props = {
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
  flex: 1 1 50%;

  ${props => props.theme.media('medium')`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    flex: 1 1 30%;
  `}

  ${props => props.theme.media('large')`
    margin-top: 1rem;
    `}
`;

const SocialsContainer = styled(Space)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  align-self: flex-start;
  flex: 1 1 100%;
  margin: 1rem 0;

  ${props => props.theme.media('medium')`
    flex: 0 1 auto;
    margin: 0;
    `}

  ${props => props.theme.media('large')`
    flex: 0 1 100%;
    justify-content: flex-end;
    margin-top: 1rem;
    `}

  ${props => props.theme.media('xlarge')`
    flex: 0 1 auto;
    justify-content: space-between;
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
`;

const FooterLicense = styled.p.attrs({ className: font('intr', 6) })`
  display: inline;
  margin: 0 1rem 1rem 0;
`;

const BackToTopButton = styled.button.attrs({
  className: 'is-hidden-s plain-button',
})`
  text-decoration: underline;
  color: ${props => props.theme.color('white')};
  padding: 0;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    text-decoration: none;
  }
`;

// Component
const Footer: FunctionComponent<Props> = ({ venues }: Props) => {
  const footer = useRef<HTMLDivElement>(null);

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
            <h4 className={font('intb', 5)}>Today&rsquo;s opening times</h4>
            <OpeningTimes venues={venues} />
            <Space as="p" v={{ size: 'm', properties: ['margin-top'] }}>
              <a href="/opening-times">Opening times</a>
            </Space>
          </OpeningTimesContainer>

          <InternalNavigationContainer>
            <FooterNav
              type="InternalNavigation"
              ariaLabel="Useful internal links"
            />
          </InternalNavigationContainer>

          <FullWidthDivider>
            <Divider lineColor="neutral.700" />
          </FullWidthDivider>

          <PoliciesContainer>
            <FooterNav
              isInline
              type="PoliciesNavigation"
              ariaLabel="Policies navigation"
            />
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

          <BackToTopButton
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
            }}
          >
            Back to top
          </BackToTopButton>
        </FooterBottom>
      </div>
    </Wrapper>
  );
};

export default Footer;
