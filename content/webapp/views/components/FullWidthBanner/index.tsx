import * as prismic from '@prismicio/client';
import NextLink from 'next/link';
import styled from 'styled-components';

import { arrowSmall, web } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import AnimatedUnderlineCSS, {
  AnimatedUnderlineProps,
} from '@weco/common/views/components/styled/AnimatedUnderline';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import WShape from '@weco/common/views/components/WShape';
import CaptionedImage from '@weco/content/views/components/CaptionedImage';
import MoreLink from '@weco/content/views/components/MoreLink';
import SectionHeader from '@weco/content/views/components/SectionHeader';

const customBreakpoint = '768px';

const ContentContainer = styled(Space)`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${customBreakpoint}) {
    flex-direction: row;
  }
`;

const CopySection = styled.div`
  flex: 1 1 50%;
  order: 1;
  margin-right: 0;

  @media (min-width: ${customBreakpoint}) {
    margin-right: 2rem;
  }
`;

const ImageSection = styled.div`
  flex: 1 1 50%;
  width: 100%;
  order: 0;
  margin-bottom: 2rem;

  @media (min-width: ${customBreakpoint}) {
    order: 2;
    margin-bottom: 0;
  }
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
    height: 105%;
    left: -20%;
    right: -20%;
    transform: translateY(-50%);
    position: relative;

    @media (min-width: ${customBreakpoint}) {
      grid-column: 10 / span 14;
      height: 140%;
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
      <WShapeWrapper $isDefaultVariant={isDefaultVariant}>
        <WShape variant={isDefaultVariant ? 'full-1' : 'full-2'} />
      </WShapeWrapper>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <ContaineredLayout gridSizes={gridSize12()}>
          <ContentContainer
            $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
          >
            <CopySection>
              {props.title && (
                <SectionHeader title={props.title}></SectionHeader>
              )}
              {props.description && <p>{props.description}</p>}

              <p>This is a test</p>

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
            </CopySection>

            {props.image && (
              <ImageSection>
                <CaptionedImage
                  image={props.image}
                  hasRoundedCorners={false}
                  caption={[]}
                />
              </ImageSection>
            )}
          </ContentContainer>
        </ContaineredLayout>
      </div>
    </MainBackground>
  );
};

export default FullWidthBanner;
