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
import LLShape from '@weco/common/views/components/LLShape';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import AnimatedUnderlineCSS, {
  AnimatedUnderlineProps,
} from '@weco/common/views/components/styled/AnimatedUnderline';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import MoreLink from '@weco/content/views/components/MoreLink';
import SectionHeader from '@weco/content/views/components/SectionHeader';

const ContentContainer = styled(Space)`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${props =>
    props.theme.media('medium')(`
    flex-direction: row;
  `)}
`;

const CopySection = styled.div`
  flex: 1 1 50%;
  align-self: flex-start;
  order: 1;
  margin-right: 0;

  ${props =>
    props.theme.media('medium')(`
    margin-right: 2rem;
  `)}
`;

const ImageSection = styled.div`
  flex: 1 1 50%;
  width: 100%;
  order: 0;
  margin-bottom: 2rem;
  position: relative;

  ${props =>
    props.theme.media('medium')(`
    order: 2;
    margin-bottom: 0;
  `)}
`;

const SupportText = styled(Space).attrs({
  className: font('sans', -1),
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

const ImageShapeWrapper = styled.div.attrs({ 'aria-hidden': 'true' })<{
  $isDefaultVariant: boolean;
}>`
  position: absolute;
  z-index: -1;
  color: ${props =>
    props.theme.color(
      props.$isDefaultVariant ? 'accent.salmon' : 'accent.turquoise'
    )};
  display: flex;
  width: 100%;
  height: 150%;
  transform: translate(
      ${props => (props.$isDefaultVariant ? '40%, -34%' : '45%, -34%')}
    )
    rotate(${props => (props.$isDefaultVariant ? '6deg' : '-16deg')});

  ${props =>
    props.theme.media('medium')(`
      height: 160%;
      transform: translate(${props.$isDefaultVariant ? '18%, -16%' : '20%, -19%'})
        rotate(${props.$isDefaultVariant ? '6deg' : '-16deg'});
    `)}

  ${props =>
    props.theme.media('large')(`
      transform: translate(${props.$isDefaultVariant ? '10%, -4%' : '20%, -31%'})
        rotate(${props.$isDefaultVariant ? '6deg' : '-16deg'});
    `)}
`;

const StyledLink = styled(NextLink)<AnimatedUnderlineProps>`
  ${AnimatedUnderlineCSS}
  text-decoration: none;
  display: inline-block;

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
      <div style={{ position: 'relative', zIndex: 1 }}>
        <ContaineredLayout gridSizes={gridSize12()}>
          <ContentContainer
            $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
          >
            <CopySection>
              {props.title && (
                <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
                  <SectionHeader title={props.title}></SectionHeader>
                </Space>
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
            </CopySection>
            {props.image && (
              <ImageSection>
                <ImageShapeWrapper $isDefaultVariant={isDefaultVariant}>
                  <LLShape />
                </ImageShapeWrapper>
                <PrismicImage
                  image={{ ...props.image, alt: '' }}
                  quality="high"
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
