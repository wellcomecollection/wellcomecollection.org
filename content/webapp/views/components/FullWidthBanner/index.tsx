import * as prismic from '@prismicio/client';
import NextLink from 'next/link';
import styled from 'styled-components';

import { arrowSmall, web, zoomIn } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import CaptionedImage from '@weco/content/views/components/CaptionedImage';
import MoreLink from '@weco/content/views/components/MoreLink';
import SectionHeader from '@weco/content/views/components/SectionHeader';
import WShape from '@weco/content/views/components/WShape';

const ContentContainer = styled(Space)`
  display: flex;
  flex-direction: column;

  ${props => props.theme.media('medium')`
    flex-direction: row;
  `}
`;

const CopySection = styled.div`
  flex: 1 1 50%;
  order: 1;
  margin-right: 0;

  ${props => props.theme.media('medium')`
    margin-right: 2rem;
  `}
`;

const ImageSection = styled.div`
  flex: 1 1 50%;
  order: 0;
  margin-bottom: 2rem;

  ${props => props.theme.media('medium')`
    order: 2;
    margin-bottom: 0;
  `}
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

const IconWrapper = styled.span`
  display: inline-flex;
  align-self: center;
  margin-left: 4px;
`;

const MainBackground = styled.div<{ $isDefaultVariant: boolean }>`
  position: relative;
  overflow: hidden;
  background-color: ${props =>
    props.theme.color(
      props.$isDefaultVariant ? 'accent.lightBlue' : 'accent.lightPurple'
    )};
`;

const WShapeWrapper = styled.div<{ $isDefaultVariant: boolean }>`
  position: absolute;
  z-index: 0;
  color: ${props =>
    props.theme.color(
      props.$isDefaultVariant ? 'accent.salmon' : 'accent.turquoise'
    )};
  top: -20%;
  right: -10%;
  width: 70%;
`;

const LinksWithArrow = ({ links }: { links: Link[] }) => {
  return links.map(link => (
    <li key={link.url}>
      <NextLink
        href={link.url}
        style={{ display: 'flex', marginBottom: '1rem' }}
      >
        {link.text || 'Find out more'}
        <IconWrapper>
          <Icon icon={arrowSmall} />
        </IconWrapper>
      </NextLink>
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
        <WShape variant={isDefaultVariant ? '3' : '2'} />
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
