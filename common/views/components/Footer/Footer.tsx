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
import {
  Wrapper,
  FooterBasicSection,
  FooterNavigationContainer,
  FindUsContainer,
  OpeningTimesContainer,
  InternalNavigationContainer,
  FullWidthDivider,
  PoliciesContainer,
  FooterBottom,
  FooterLicense,
  SocialsContainer,
} from './Footer.styles';

// Utils / Types
import { font } from '@weco/common/utils/classnames';
import { Venue } from '@weco/common/model/opening-hours';

type Props = {
  hide: boolean;
  venues: Venue[];
};

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
