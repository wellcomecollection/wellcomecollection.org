import { useRef, useEffect, FunctionComponent } from 'react';
import { arrow, cc, ccBy, wellcome } from '@weco/common/icons';
import { font, grid, classNames } from '../../../utils/classnames';
import FooterWellcomeLogo from './FooterWellcomeLogo';
import FooterNav from './FooterNav';
import FindUs from '../FindUs/FindUs';
import FooterSocial from './FooterSocial';
import Icon from '../Icon/Icon';
import styled from 'styled-components';
import Space from '../styled/Space';
import OpeningTimes from '../OpeningTimes/OpeningTimes';
import { Venue } from '../../../model/opening-hours';

const FooterNavWrapper = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
  },
})`
  border-top: 1px solid ${props => props.theme.color('charcoal')};
  border-bottom: 1px solid ${props => props.theme.color('charcoal')};
`;

const HygieneNav = styled(Space).attrs({
  as: 'nav',
  h: { size: 'l', properties: ['margin-bottom'] },
  className: classNames({
    'relative flex-1': true,
  }),
})`
  border-bottom: 1px solid ${props => props.theme.color('charcoal')};
`;

const HygieneList = styled(Space).attrs({
  as: 'ul',
  h: { size: 'l', properties: ['margin-top', 'margin-bottom'] },
  className: classNames({
    'plain-list no-margin no-padding': true,
    'flex flex--h-space-between': true,
  }),
})`
  border-top: 1px solid ${props => props.theme.color('charcoal')};
`;

const FooterBottom = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-bottom'] },
  className: classNames({
    'flex flex--wrap flex--h-space-between flex--v-start': true,
  }),
})`
  border-top: 1px solid ${props => props.theme.color('charcoal')};
`;

const NavBrand = styled.a`
  position: absolute;
  bottom: 0;
  display: block;
`;

const FooterLeft = styled.div.attrs({
  className: classNames({
    'flex flex--v-start': true,
  }),
})`
  flex-wrap: wrap;

  ${props => props.theme.media.medium`
    flex-wrap: nowrap;
  `}
`;

const FooterStrap = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['margin-top', 'padding-bottom', 'margin-bottom'],
  },
  className: classNames({
    'flex flex--v-center': true,
  }),
})`
  min-width: 220px;
  border-bottom: 1px solid charcoal;
  width: 100%;

  ${props => props.theme.media.medium`
    width: auto;
    border-bottom: 0;
    border-right: 1px solid ${props.theme.color('charcoal')};
    margin-right: 24px;
    padding-right: 24px;
  `}
`;

const StrapText = styled.div`
  max-width: 10rem;
`;

const HygieneItem = styled.li.attrs({
  className: classNames({
    [font('hnb', 6)]: true,
  }),
})`
  width: 100%;
  text-align: center;

  &:last-child {
    position: absolute;
    bottom: -45px;
    left: 0;

    ${props => props.theme.media.large`
      position: static;
    `}
  }

  a {
    padding: 0.5em 0;
    display: block;
    text-decoration: none;
    border-left: 1px solid ${props => props.theme.color('charcoal')};
    transition: color 200ms ease;

    &:hover {
      color: ${props => props.theme.color('green')};
    }

    ${props => props.theme.media.xlarge`
      padding-left: 2em;
      padding-right: 2em;
    `}

    &.footer__hygiene-link--back-to-top {
      display: flex;
      align-items: center;
      border-left: 0;

      ${props => props.theme.media.large`
        border-left: 1px solid ${props => props.theme.color('charcoal')};
        justify-content: center;
      `}

      ${props => props.theme.media.xlarge`
        padding-right: 0;
      `}

      .icon__shape {
        fill: ${props => props.theme.color('currentColor')};
      }
    }
  }

  &:first-child a {
    border-left: 0;
  }
`;

const TopBorderBox = styled.div`
  @media (min-width: ${props => props.theme.sizes.large}px) {
    border-top: 1px solid ${props => props.theme.color('charcoal')};
    border-bottom: 0;
  }
`;
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
    <Space
      v={{ size: 'xl', properties: ['padding-top'] }}
      ref={footer}
      className={classNames({
        'row bg-black relative font-white': true,
      })}
    >
      <div className="container">
        <div className="grid">
          <div className={`${grid({ s: 12, m: 12, l: 4 })}`}>
            <Space
              v={{
                size: 'm',
                properties: ['margin-bottom'],
              }}
              as="h3"
              className={`relative ${font('hnr', 4)}`}
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
          <div className={`${grid({ s: 12, m: 6, l: 4 })}`}>
            <Space
              v={{
                size: 'm',
                properties: ['margin-bottom'],
              }}
              as="h3"
              className={`hidden is-hidden-s is-hidden-m ${font('hnr', 5)}`}
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
            className={classNames({
              [grid({ s: 12, m: 6, l: 4, xl: 4 })]: true,
              [font('hnr', 5)]: true,
            })}
          >
            <Space
              v={{
                size: 'm',
                properties: ['margin-bottom'],
              }}
              as="h3"
              className={`hidden is-hidden-s is-hidden-m ${font('hnr', 5)}`}
            >
              {`Opening times:`}
            </Space>
            <TopBorderBox>
              <Space
                className={'flex'}
                v={{ size: 'l', properties: ['padding-top'] }}
              >
                <div
                  className={classNames({
                    [font('hnr', 5)]: true,
                    'float-l': true,
                  })}
                >
                  <h4
                    className={classNames({
                      [font('hnb', 5)]: true,
                      'no-margin': true,
                    })}
                  >{`Today's opening times`}</h4>
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
            <FooterStrap
              className={classNames({
                [font('hnb', 6)]: true,
              })}
            >
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
              className={classNames({
                [font('hnb', 6)]: true,
                'flex flex--v-center': true,
              })}
            >
              <div
                className={classNames({
                  flex: true,
                })}
              >
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
    </Space>
  );
};

export default Footer;
