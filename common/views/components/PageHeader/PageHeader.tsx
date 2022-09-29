import { font } from '../../../utils/classnames';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import LabelsList from '../LabelsList/LabelsList';
import PrismicImage from '../PrismicImage/PrismicImage';
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import { Picture } from '../Picture/Picture';
import HeaderBackground from '../HeaderBackground/HeaderBackground';
import HighlightedHeading from './HighlightedHeading';
import Layout10 from '../Layout10/Layout10';
import Layout from '../Layout/Layout';
import { gridSize12 } from '../Layout12/Layout12';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import WobblyBottom from '../WobblyBottom/WobblyBottom';
import {
  FunctionComponent,
  ReactNode,
  ReactElement,
  ComponentProps,
} from 'react';
import Space from '../styled/Space';
import styled from 'styled-components';
import { SectionPageHeader } from '@weco/common/views/components/styled/SectionPageHeader';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import { PaletteColor } from '@weco/common/views/themes/config';

// The `bottom` values here are coupled to the space
// beneath the Header in ContentPage.tsx
export const headerSpaceSize = 'l';
const HeroPictureBackground = styled.div<{ bgColor: PaletteColor }>`
  position: absolute;
  background-color: ${props => props.theme.color(props.bgColor)};
  height: 50%;
  width: 100%;
  bottom: -${props => props.theme.spaceAtBreakpoints.small[headerSpaceSize]}px;

  ${props => props.theme.media.medium`
    bottom: -${props =>
      props.theme.spaceAtBreakpoints.medium[headerSpaceSize]}px;
  `}

  ${props => props.theme.media.large`
    bottom: -${props =>
      props.theme.spaceAtBreakpoints.large[headerSpaceSize]}px;
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
  | ReactElement<typeof PrismicImage>
  | typeof VideoEmbed
  | typeof Picture;

type BackgroundType = ReactElement<typeof HeaderBackground>;

function addFreeLabel(labelListProps) {
  const freeLabel = {
    text: 'Free',
    labelColor: 'black',
    textColor: 'white',
  };
  const labels = [freeLabel, ...(labelListProps?.labels ?? [])];
  return { ...(labelListProps ?? {}), labels };
}

type Props = {
  breadcrumbs: ComponentProps<typeof Breadcrumb>;
  labels?: ComponentProps<typeof LabelsList>;
  title: string;
  ContentTypeInfo?: ReactNode;
  Background?: BackgroundType;
  FeaturedMedia?: FeaturedMedia;
  HeroPicture?: ReactElement<typeof Picture>;
  isFree?: boolean;
  heroImageBgColor?: 'warmNeutral.300' | 'white';
  backgroundTexture?: string;
  highlightHeading?: boolean;
  asyncBreadcrumbsRoute?: string;
  isContentTypeInfoBeforeMedia?: boolean;
  sectionLevelPage?: boolean;
  // TODO: Don't overload this, it's just for putting things in till
  // we find a pattern
  TitleTopper?: ReactNode;
};

const sectionLevelPageGridLayout = { s: 12, m: 12, l: 10, xl: 10 };
const PageHeader: FunctionComponent<Props> = ({
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
      <SectionPageHeader sectionLevelPage={sectionLevelPage ?? false}>
        {title}
      </SectionPageHeader>
    );

  const hasMedia = FeaturedMedia || HeroPicture;
  const amendedLabels = isFree ? addFreeLabel(labels) : labels;

  return (
    <>
      <div
        className="row relative"
        style={{
          backgroundImage: backgroundTexture
            ? `url(${backgroundTexture})`
            : undefined,
          backgroundSize: backgroundTexture ? 'cover' : undefined,
        }}
      >
        {Background}
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
              // We need to keep some space below the breadcrumbs to prevent
              // 'highlighted' headings from being partially concealed
              <Space
                v={{
                  size: 'm',
                  properties: ['margin-top', 'margin-bottom'],
                  overrides: { large: 4 },
                }}
              >
                {breadcrumbs.items.length > 0 ? (
                  <div
                    data-component={
                      asyncBreadcrumbsRoute ? 'AsyncBreadcrumb' : undefined
                    }
                    className={
                      asyncBreadcrumbsRoute
                        ? 'breadcrumb-placeholder'
                        : undefined
                    }
                    data-endpoint={asyncBreadcrumbsRoute || undefined}
                    data-prefix-endpoint={
                      asyncBreadcrumbsRoute ? 'false' : undefined
                    }
                    data-modifiers={asyncBreadcrumbsRoute ? '' : undefined}
                  >
                    <Breadcrumb {...breadcrumbs} />
                  </div>
                ) : (
                  <span className={`${font('intr', 5)} flex`}>&nbsp;</span>
                )}
              </Space>
            )}
            <ConditionalWrapper
              condition={sectionLevelPage ?? false}
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
                className={font('intr', 4)}
              >
                {ContentTypeInfo}
              </Space>
            )}
            {amendedLabels && amendedLabels.labels.length > 0 && (
              <LabelsList {...amendedLabels} />
            )}
          </Space>
        </Layout>

        {FeaturedMedia && (
          <Layout10>
            <div className="relative">{FeaturedMedia}</div>
          </Layout10>
        )}

        {HeroPicture && (
          <div className="relative" style={{ height: '100%' }}>
            <HeroPictureBackground bgColor={heroImageBgColor} />

            <HeroPictureContainer>
              <WobblyBottom color={heroImageBgColor}>
                {HeroPicture}
              </WobblyBottom>
            </HeroPictureContainer>
          </div>
        )}
      </div>
      {!hasMedia && !isContentTypeInfoBeforeMedia && !sectionLevelPage && (
        <WobblyEdge background="white" />
      )}
      {!isContentTypeInfoBeforeMedia && ContentTypeInfo && (
        <Layout gridSizes={sectionLevelPageGridLayout}>
          <Space
            v={{
              size: 'l',
              properties: ['margin-top'],
            }}
            className={font('intb', 4)}
          >
            {ContentTypeInfo}
          </Space>
        </Layout>
      )}
    </>
  );
};

export default PageHeader;
