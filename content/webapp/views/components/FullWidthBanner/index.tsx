import * as prismic from '@prismicio/client';
import NextLink from 'next/link';
import styled from 'styled-components';

import { arrowSmall, web } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Layout, { gridSize12 } from '@weco/common/views/components/Layout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import AnimatedUnderlineCSS, {
  AnimatedUnderlineProps,
} from '@weco/common/views/components/styled/AnimatedUnderline';
import { Container } from '@weco/common/views/components/styled/Container';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import WShape from '@weco/common/views/components/WShape';
import { themeValues } from '@weco/common/views/themes/config';
import MoreLink from '@weco/content/views/components/MoreLink';
import SectionHeader from '@weco/content/views/components/SectionHeader';

const customBreakpoint = '768px';

const BannerContentWrapper = styled(Space)`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${customBreakpoint}) {
    flex-direction: row;
  }
`;

const CopySectionContainer = styled.div`
  flex: 1 1 50%;
  padding: 0 ${themeValues.containerPadding.small}px;
  align-self: flex-start;
  order: 1;
  z-index: 3;

  @media (min-width: ${customBreakpoint}) {
    padding: 0 ${themeValues.containerPadding.medium}px;
  }

  ${themeValues.media('large')(`
    padding: 0 0 0 ${themeValues.containerPadding.large}px;
    margin-right: 2rem;
  `)}
`;

const ImageSectionContainer = styled(Container)`
  flex: 1 1 50%;
  width: 100%;
  order: 0;
  margin-bottom: 2rem;
  padding: 0 ${themeValues.containerPadding.small}px;

  img {
    z-index: 4;
    position: relative;
  }

  @media (min-width: ${customBreakpoint}) {
    padding: 0 ${themeValues.containerPadding.medium}px 0 0;
    order: 2;
    margin-bottom: 0;
  }

  ${themeValues.media('large')(`
    padding: 0 ${themeValues.containerPadding.large}px 0 0;
  `)}
`;

const SupportText = styled(Space).attrs({
  className: font('intr', 5),
  $v: { size: 'l', properties: ['margin-top'] },
})`
  display: flex;

  p {
    margin-bottom: 0;
    margin-left: 10px;
  }
`;

const MainBackground = styled.div<{ $isDefaultVariant: boolean }>`
  position: relative;
  overflow: hidden;
  background-color: ${props =>
    props.theme.color(
      props.$isDefaultVariant ? 'accent.lightBlue' : 'accent.lightPurple'
    )};
`;

const WShapeWrapper = styled.div.attrs({ 'aria-hidden': 'true' })<{
  $isDefaultVariant: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  color: ${props =>
    props.theme.color(
      props.$isDefaultVariant ? 'accent.salmon' : 'accent.turquoise'
    )};
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(24, 1fr);

  svg {
    grid-column: 1 / -1;
    width: 140%;
    left: -20%;
    right: -20%;
    transform: translateY(-40%);
    position: relative;

    @media (min-width: ${customBreakpoint}) {
      grid-column: 10 / span 14;
      transform: translateY(-50%);
      height: 140%;
      width: auto;
      top: 50%;
      right: -20%;
      left: auto;
    }
  }
`;

const StyledLink = styled(NextLink)<AnimatedUnderlineProps>`
  ${AnimatedUnderlineCSS}
  text-decoration: none;

  & > span {
    vertical-align: text-bottom;
  }
`;

const IconWrapper = styled.span`
  display: inline-block;
  margin-left: 4px;
  max-height: 1lh;

  /* Removes the underline animation from the icon */
  background-image: none !important;

  & > span {
    display: block;
  }
`;

const LinksWithArrow = ({ links }: { links: Link[] }) => {
  return links.map(link => (
    <li key={link.url} style={{ marginBottom: '1rem' }}>
      <StyledLink $lineColor="black" href={link.url}>
        <span>{link.text || 'Find out more'}</span>
        <IconWrapper>
          <Icon icon={arrowSmall} />
        </IconWrapper>
      </StyledLink>
    </li>
  ));
};

type SharedProps = {
  title?: string;
  description?: string;
  image?: ImageType;
};

type Link = {
  text?: string;
  url: string;
};

export type Props = SharedProps &
  (
    | {
        variant: 'default';
        link?: Link;
        supportText?: prismic.RichTextField;
      }
    | {
        variant: 'twoLinks';
        links: Link[];
      }
  );

const FullWidthBanner = (props: Props) => {
  const { variant } = props;
  const isDefaultVariant = variant === 'default';
  const isTwoLinksVariant = variant === 'twoLinks';

  return (
    <MainBackground
      data-component="full-width-banner"
      $isDefaultVariant={isDefaultVariant}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: `${themeValues.sizes.xlarge}px`,
          margin: '0 auto',
          zIndex: 1,
        }}
      >
        <Layout gridSizes={gridSize12()}>
          <BannerContentWrapper
            $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
          >
            <CopySectionContainer>
              {props.title && (
                <SectionHeader title={props.title}></SectionHeader>
              )}
              {props.description && <p>{props.description}</p>}

              {isDefaultVariant && (
                <>
                  {props.link && (
                    <MoreLink
                      name={props.link.text || 'Find out more'}
                      url={props.link.url}
                    />
                  )}

                  {props.supportText && (
                    <SupportText>
                      <Icon icon={web} />

                      <PrismicHtmlBlock html={props.supportText} />
                    </SupportText>
                  )}
                </>
              )}

              {isTwoLinksVariant && props.links?.length > 0 && (
                <PlainList>
                  <LinksWithArrow links={props.links} />
                </PlainList>
              )}
            </CopySectionContainer>

            <ImageSectionContainer>
              <WShapeWrapper $isDefaultVariant={isDefaultVariant}>
                <WShape variant={isDefaultVariant ? 'full-1' : 'full-2'} />
              </WShapeWrapper>

              {props.image && (
                <PrismicImage
                  image={{ ...props.image, alt: '' }}
                  quality="high"
                />
              )}
            </ImageSectionContainer>
          </BannerContentWrapper>
        </Layout>
      </div>
    </MainBackground>
  );
};

export default FullWidthBanner;
