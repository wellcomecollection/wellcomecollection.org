import { useRef, useEffect, FunctionComponent } from 'react';

// Components
import FooterWellcomeLogo from './FooterWellcomeLogo';
import FooterNav from './FooterNav';
import FindUs from '../FindUs/FindUs';
import FooterSocial from './FooterSocial';
import Space from '@weco/common/views/components/styled/Space';
import OpeningTimes from '@weco/common/views/components/OpeningTimes/OpeningTimes';
import {
  Wrapper,
  FooterUsefulInformation,
  FooterOpeningTimes,
  FooterBottom,
  FooterLicense,
} from './Footer.styles';

// Utils/Helpers
import { font } from '@weco/common/utils/classnames';
import { links } from '@weco/common/views/components/Header/Header';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';

// Types
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
        <Space as="h3" v={{ size: 'l', properties: ['padding-bottom'] }}>
          <FooterWellcomeLogo />
        </Space>
        <FooterUsefulInformation>
          <FindUs />

          <FooterOpeningTimes>
            <h4 className={font('intb', 5)}>{`Today's opening times`}</h4>
            {venues && <OpeningTimes venues={venues} />}
            <Space as="p" v={{ size: 's', properties: ['margin-top'] }}>
              <a href="/opening-times">Opening times</a>
            </Space>
          </FooterOpeningTimes>

          <FooterNav
            items={[
              ...links,
              {
                href: `/pages/${prismicPageIds.contactUs}`,
                title: 'Contact us',
              },
            ]}
          />
        </FooterUsefulInformation>

        <FooterNav
          isInline
          items={[
            { href: 'https://wellcome.org/jobs', title: 'Jobs' },
            {
              href: 'https://wellcome.org/who-we-are/privacy-and-terms',
              title: 'Privacy',
            },
            {
              href: 'https://wellcome.org/who-we-are/privacy-and-terms',
              title: 'Cookies',
            },
            {
              href: 'https://wellcomecollection.org/press',
              title: 'Media office',
            },
            {
              href: 'https://developers.wellcomecollection.org',
              title: 'Developers',
            },
          ]}
        />

        <FooterSocial />
        <FooterBottom>
          <FooterLicense>
            Except where otherwise noted, content on this site is licensed under
            a{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/">
              Creative Commons Attribution 4.0 International Licence
            </a>
          </FooterLicense>
          <a href="#top">Back to top</a>
        </FooterBottom>
      </div>
    </Wrapper>
  );
};

export default Footer;
