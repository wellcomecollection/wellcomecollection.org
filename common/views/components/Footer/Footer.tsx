import { useRef, useEffect, FunctionComponent } from 'react';

// Components
import FooterWellcomeLogo from './FooterWellcomeLogo';
import FooterNav from './FooterNav';
import FindUs from '../FindUs/FindUs';
import FooterSocial from './FooterSocial';
import Icon from '@weco/common/views/components/Icon/Icon';
import { arrow, cc, ccBy, wellcome } from '@weco/common/icons';
import Space from '@weco/common/views/components/styled/Space';
import OpeningTimes from '@weco/common/views/components/OpeningTimes/OpeningTimes';
import {
  Wrapper,
  FooterUsefulInformation,
  FooterOpeningTimes,
  NavBrand,
  FooterNavWrapper,
  TopBorderBox,
  FooterBottom,
  FooterLeft,
  FooterStrap,
  HygieneItem,
  HygieneList,
  HygieneNav,
  StrapText,
} from './Footer.styles';

// Utils/Helpers
import { font, grid } from '@weco/common/utils/classnames';

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

          <FooterNav />
        </FooterUsefulInformation>

        <HygieneNav>
          <HygieneList>
            <HygieneItem>
              <a
                href="https://wellcome.org/jobs"
                className="footer__hygiene-link"
              >
                Jobs
              </a>
            </HygieneItem>
            <HygieneItem>
              <a
                href="https://wellcome.org/who-we-are/privacy-and-terms"
                className="footer__hygiene-link"
              >
                Privacy
              </a>
            </HygieneItem>
            <HygieneItem>
              <a
                href="https://wellcome.org/who-we-are/privacy-and-terms"
                className="footer__hygiene-link"
              >
                Cookies
              </a>
            </HygieneItem>
            <HygieneItem>
              <a
                href="https://wellcomecollection.org/press"
                className="footer__hygiene-link"
              >
                Media office
              </a>
            </HygieneItem>
            <HygieneItem>
              <a
                href="https://developers.wellcomecollection.org"
                className="footer__hygiene-link"
              >
                Developers
              </a>
            </HygieneItem>
          </HygieneList>
        </HygieneNav>
      </div>
    </Wrapper>
  );
  return (
    <Wrapper>
      <div className="container">
        <div className="grid">
          <div className={grid({ s: 12, m: 12, l: 4 })}>
            <Space
              v={{
                size: 'm',
                properties: ['margin-bottom'],
              }}
              as="h3"
              className={`relative ${font('intr', 4)}`}
            >
              <span className="hidden">Wellcome collection</span>
              <NavBrand href="#">
                <FooterWellcomeLogo />
              </NavBrand>
            </Space>
            <FooterNavWrapper>
              <FooterNav />
            </FooterNavWrapper>
          </div>
          <div className={grid({ s: 12, m: 6, l: 4 })}>
            <Space
              v={{
                size: 'm',
                properties: ['margin-bottom'],
              }}
              as="h3"
              className={`hidden is-hidden-s is-hidden-m ${font('intr', 5)}`}
            >
              Finding us:
            </Space>
            <TopBorderBox>
              <Space v={{ size: 'l', properties: ['padding-top'] }}>
                <FindUs />
              </Space>
            </TopBorderBox>
          </div>
          <div
            className={
              grid({ s: 12, m: 6, l: 4, xl: 4 }) + ' ' + font('intr', 5)
            }
          >
            <Space
              v={{
                size: 'm',
                properties: ['margin-bottom'],
              }}
              as="h3"
              className={`hidden is-hidden-s is-hidden-m ${font('intr', 5)}`}
            >
              {`Opening times:`}
            </Space>
            <TopBorderBox>
              <Space
                className="flex"
                v={{ size: 'l', properties: ['padding-top'] }}
              >
                <div className={`${font('intr', 5)} float-l`}>
                  <h4
                    className={`${font('intb', 5)} no-margin`}
                  >{`Today’s opening times`}</h4>
                  {venues && <OpeningTimes venues={venues} />}
                  <Space v={{ size: 's', properties: ['margin-top'] }} as="p">
                    <a href="/opening-times">Opening times</a>
                  </Space>
                </div>
              </Space>
            </TopBorderBox>
          </div>
        </div>
        <FooterSocial />
        <FooterBottom>
          <FooterLeft>
            <FooterStrap className={font('intb', 6)}>
              <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
                <Icon icon={wellcome} />
              </Space>
              <StrapText>The free museum and library from Wellcome</StrapText>
            </FooterStrap>
            <Space
              v={{
                size: 'm',
                properties: ['margin-top', 'padding-bottom', 'margin-bottom'],
              }}
              className={`${font('intb', 6)} flex flex--v-center`}
            >
              <div className="flex">
                <Space h={{ size: 's', properties: ['margin-right'] }}>
                  <Icon icon={cc} />
                </Space>
                <Space h={{ size: 's', properties: ['margin-right'] }}>
                  <Icon icon={ccBy} />
                </Space>
              </div>
              <p className="no-margin">
                Except where otherwise noted, content on this site is licensed
                under a{' '}
                <a
                  className="footer__licensing-link"
                  href="https://creativecommons.org/licenses/by/4.0/"
                >
                  {' '}
                  Creative Commons Attribution 4.0 International Licence
                </a>
              </p>
            </Space>
          </FooterLeft>
          <HygieneNav>
            <HygieneList>
              <HygieneItem>
                <a
                  href="https://wellcome.org/jobs"
                  className="footer__hygiene-link"
                >
                  Jobs
                </a>
              </HygieneItem>
              <HygieneItem>
                <a
                  href="https://wellcome.org/who-we-are/privacy-and-terms"
                  className="footer__hygiene-link"
                >
                  Privacy
                </a>
              </HygieneItem>
              <HygieneItem>
                <a
                  href="https://wellcome.org/who-we-are/privacy-and-terms"
                  className="footer__hygiene-link"
                >
                  Cookies
                </a>
              </HygieneItem>
              <HygieneItem>
                <a
                  href="https://wellcomecollection.org/press"
                  className="footer__hygiene-link"
                >
                  Media office
                </a>
              </HygieneItem>
              <HygieneItem>
                <a
                  href="https://developers.wellcomecollection.org"
                  className="footer__hygiene-link"
                >
                  Developers
                </a>
              </HygieneItem>
              <HygieneItem>
                <a
                  href="#top"
                  className="footer__hygiene-link footer__hygiene-link--back-to-top"
                >
                  <span>Back to top</span>
                  <Icon icon={arrow} rotate={270} />
                </a>
              </HygieneItem>
            </HygieneList>
          </HygieneNav>
        </FooterBottom>
      </div>
    </Wrapper>
  );
};

export default Footer;
