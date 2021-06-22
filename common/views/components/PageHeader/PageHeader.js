// @flow

import { font, classNames } from '../../../utils/classnames';
// $FlowFixMe(tsx)
import Breadcrumb from '../Breadcrumb/Breadcrumb';
// $FlowFixMe (tsx)
import LabelsList from '../LabelsList/LabelsList';
import { UiImage } from '../Images/Images';
// $FlowFixMe(tsx)
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import Picture from '../Picture/Picture';
// $FlowFixMe(tsx)
import HeaderBackground from '../HeaderBackground/HeaderBackground';
import FreeSticker from '../FreeSticker/FreeSticker';
import HighlightedHeading from '../HighlightedHeading/HighlightedHeading';
// $FlowFixMe (tsx)
import Layout10 from '../Layout10/Layout10';
// $FlowFixMe (tsx)
import Layout from '../Layout/Layout';
// $FlowFixMe (tsx)
import { gridSize12 } from '../Layout12/Layout12';
// $FlowFixMe(tsx)
import WobblyEdge from '../WobblyEdge/WobblyEdge';
// $FlowFixMe(tsx)
import WobblyBottom from '../WobblyBottom/WobblyBottom';
// $FlowFixMe (ts)
import { breakpoints } from '../../../utils/breakpoints';
import type { Node, Element, ElementProps } from 'react';
import type { GenericContentFields } from '../../../model/generic-content-fields';
// $FlowFixMe (tsx)
import Space from '../styled/Space';
import styled from 'styled-components';
// $FlowFixMe (tsx)
import { SectionPageHeader } from '@weco/common/views/components/styled/SectionPageHeader';
// $FlowFixMe (tsx);
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';

// The `bottom` values here are coupled to the space
// beneath the Header in ContentPage.tsx
const HeroPictureBackground = styled.div`
  height: 50%;
  width: 100%;
  bottom: -${props => props.theme.spaceAtBreakpoints.small.l}px;

  ${props => props.theme.media.medium`
    bottom: -${props => props.theme.spaceAtBreakpoints.medium.l}px;
  `}

  ${props => props.theme.media.large`
    bottom: -${props => props.theme.spaceAtBreakpoints.large.l}px;
  `}
`;

const HeroPictureContainer = styled.div`
  max-width: 1450px;
  margin: 0 auto;

  ${props => props.theme.media.medium`
    padding-left: 24px;
    padding-right: 24px;
  `}
`;

export type FeaturedMedia =
  | Element<typeof UiImage>
  | Element<typeof VideoEmbed>
  | Element<typeof Picture>;

type BackgroundType = Element<typeof HeaderBackground>;

export function getFeaturedMedia(
  fields: GenericContentFields,
  isPicture?: boolean
): ?FeaturedMedia {
  const image = fields.promo && fields.promo.image;
  const { squareImage, widescreenImage } = fields;
  const { body } = fields;
  const tasl = image && {
    title: image.title,
    author: image.author,
    sourceName: image.source && image.source.name,
    sourceLink: image.source && image.source.link,
    license: image.license,
    copyrightHolder: image.copyright && image.copyright.holder,
    copyrightLink: image.copyright && image.copyright.link,
  };
  const hasFeaturedVideo = body.length > 0 && body[0].type === 'videoEmbed';
  const FeaturedMedia = hasFeaturedVideo ? (
    <VideoEmbed {...body[0].value} />
  ) : isPicture && widescreenImage && squareImage ? (
    <Picture
      images={[
        { ...widescreenImage, minWidth: breakpoints.medium },
        { ...squareImage, minWidth: null },
      ]}
      isFull={true}
    />
  ) : widescreenImage && tasl ? (
    <UiImage tasl={tasl} {...widescreenImage} sizesQueries="" />
  ) : image && tasl ? (
    <UiImage tasl={tasl} {...image} sizesQueries="" />
  ) : null;

  return FeaturedMedia;
}

export function getHeroPicture(
  fields: GenericContentFields
): ?Element<typeof Picture> {
  const { squareImage, widescreenImage } = fields;

  return (
    squareImage &&
    widescreenImage && (
      <Picture
        images={[
          { ...widescreenImage, minWidth: breakpoints.medium },
          { ...squareImage, minWidth: null },
        ]}
        isFull={true}
      />
    )
  );
}

type Props = {|
  breadcrumbs: ElementProps<typeof Breadcrumb>,
  labels: ?ElementProps<typeof LabelsList>,
  title: string,
  ContentTypeInfo: ?Node,
  Background: ?BackgroundType,
  FeaturedMedia: ?FeaturedMedia,
  HeroPicture: ?Element<typeof Picture>,
  isFree?: boolean,
  heroImageBgColor?: 'white' | 'cream',
  backgroundTexture?: ?string,
  highlightHeading?: boolean,
  asyncBreadcrumbsRoute?: string,
  isContentTypeInfoBeforeMedia?: boolean,
  sectionLevelPage?: boolean,
  // TODO: Don't overload this, it's just for putting things in till
  // we find a pattern
  TitleTopper?: Node,
|};

const sectionLevelPageGridLayout = { s: 12, m: 10, l: 8, xl: 8 };
const PageHeader = ({
  breadcrumbs,
  labels,
  title,
  ContentTypeInfo,
  Background,
  HeroPicture,
  FeaturedMedia,
  isFree = false,
  isContentTypeInfoBeforeMedia = false,
  // Not a massive fan of this, but it feels overkill to make a new component
  // for it as it's only used on articles and exhibitions
  heroImageBgColor = 'white',
  backgroundTexture,
  highlightHeading,
  asyncBreadcrumbsRoute,
  TitleTopper,
  sectionLevelPage,
}: Props) => {
  const Heading =
    highlightHeading && !sectionLevelPage ? (
      <HighlightedHeading text={title} />
    ) : (
      <SectionPageHeader sectionLevelPage={sectionLevelPage}>
        {title}
      </SectionPageHeader>
    );

  const hasMedia = FeaturedMedia || HeroPicture;
  return (
    <>
      <div
        className={`row relative`}
        style={{
          backgroundImage: backgroundTexture
            ? `url(${backgroundTexture})`
            : null,
          backgroundSize: backgroundTexture ? 'cover' : null,
        }}
      >
        {Background}
        {isFree && (
          <Layout10>
            <div className="relative">
              <FreeSticker />
            </div>
          </Layout10>
        )}
        <Layout
          gridSizes={sectionLevelPage ? gridSize12 : sectionLevelPageGridLayout}
        >
          <Space
            v={{
              size: 'l',
              properties:
                isContentTypeInfoBeforeMedia || hasMedia || sectionLevelPage
                  ? ['margin-bottom']
                  : ['margin-bottom', 'padding-bottom'],
            }}
          >
            {!sectionLevelPage && (
              <Space
                v={{
                  size: 's',
                  properties: ['margin-top', 'margin-bottom'],
                }}
              >
                {breadcrumbs.items.length > 0 ? (
                  <>
                    {!asyncBreadcrumbsRoute && <Breadcrumb {...breadcrumbs} />}
                    {asyncBreadcrumbsRoute && (
                      <div
                        data-component="AsyncBreadcrumb"
                        className="async-content breadcrumb-placeholder"
                        data-endpoint={asyncBreadcrumbsRoute}
                        data-prefix-endpoint="false"
                        data-modifiers=""
                      >
                        <Breadcrumb {...breadcrumbs} />
                      </div>
                    )}
                  </>
                ) : (
                  <span
                    className={classNames({
                      [font('hnr', 5)]: true,
                      flex: true,
                    })}
                  >
                    &nbsp;
                  </span>
                )}
              </Space>
            )}
            <ConditionalWrapper
              condition={sectionLevelPage}
              wrapper={children => (
                <Space v={{ size: 'l', properties: ['margin-top'] }}>
                  {children}
                </Space>
              )}
            >
              {TitleTopper}
              {Heading}
            </ConditionalWrapper>

            {isContentTypeInfoBeforeMedia && ContentTypeInfo && (
              <Space
                v={{ size: 'm', properties: ['margin-bottom'] }}
                className={classNames({
                  [font('hnr', 4)]: true,
                })}
              >
                {ContentTypeInfo}
              </Space>
            )}

            {labels && labels.labels.length > 0 && <LabelsList {...labels} />}
          </Space>
        </Layout>

        {FeaturedMedia && (
          <Layout10>
            <div className="relative">{FeaturedMedia}</div>
          </Layout10>
        )}

        {HeroPicture && (
          <div
            className={classNames({
              relative: true,
            })}
            style={{ height: '100%' }}
          >
            <HeroPictureBackground
              className={`bg-${heroImageBgColor} absolute`}
            />

            <HeroPictureContainer>
              <WobblyBottom color={heroImageBgColor}>
                {HeroPicture}
              </WobblyBottom>
            </HeroPictureContainer>
          </div>
        )}
      </div>
      {!hasMedia && !isContentTypeInfoBeforeMedia && !sectionLevelPage && (
        <WobblyEdge background={'white'} />
      )}
      {!isContentTypeInfoBeforeMedia && ContentTypeInfo && (
        <Layout gridSizes={sectionLevelPageGridLayout}>
          <Space
            v={{
              size: 'l',
              properties: ['margin-top'],
            }}
            className={classNames({
              [font('hnb', 4)]: true,
            })}
          >
            {ContentTypeInfo}
          </Space>
        </Layout>
      )}
    </>
  );
};

export default PageHeader;
