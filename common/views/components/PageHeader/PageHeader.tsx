import {
  FunctionComponent,
  ReactNode,
  ReactElement,
  ComponentProps,
} from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import Breadcrumb from '@weco/common/views/components/Breadcrumb/Breadcrumb';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import { Picture } from '@weco/common/views/components/Picture/Picture';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import HighlightedHeading from './HighlightedHeading';
import Layout, {
  gridSize10,
  gridSize12,
} from '@weco/common/views/components/Layout';
import WobblyEdge from '@weco/common/views/components/WobblyEdge/WobblyEdge';
import WobblyBottom from '@weco/common/views/components/WobblyBottom/WobblyBottom';
import Space from '@weco/common/views/components/styled/Space';
import { SectionPageHeader } from '@weco/common/views/components/styled/SectionPageHeader';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import { PaletteColor } from '@weco/common/views/themes/config';

const Container = styled.div<{
  $backgroundTexture?: string;
}>`
  position: relative;
  background-image: ${props =>
    props.$backgroundTexture
      ? `url(${props.$backgroundTexture})`
      : 'undefined'};
  background-size: ${props =>
    props.$backgroundTexture ? 'cover' : 'undefined'};
`;

const Wrapper = styled(Space)`
  @media print {
    margin: 0;
    padding: 0;
  }
`;

// The `bottom` values here are coupled to the space
// beneath the Header in ContentPage.tsx
export const headerSpaceSize = 'l';
const HeroPictureBackground = styled.div.attrs({
  className: 'is-hidden-print',
})<{ $bgColor: PaletteColor }>`
  position: absolute;
  background-color: ${props => props.theme.color(props.$bgColor)};
  height: 50%;
  width: 100%;
  bottom: -${props => props.theme.spaceAtBreakpoints.small[headerSpaceSize]}px;

  ${props =>
    props.theme.media('medium')(
      `bottom: -${props.theme.spaceAtBreakpoints.medium[headerSpaceSize]}px;`
    )}

  ${props =>
    props.theme.media('large')(
      `bottom: -${props.theme.spaceAtBreakpoints.large[headerSpaceSize]}px;`
    )}
`;

const HeroPictureContainer = styled.div`
  max-width: 1450px;
  margin: 0 auto;

  ${props =>
    props.theme.media('medium')`
      padding-left: 24px;
      padding-right: 24px;
    `}
`;

export type FeaturedMedia =
  | ReactElement<typeof PrismicImage>
  | ReactElement<typeof VideoEmbed>
  | ReactElement<typeof Picture>;

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
  isContentTypeInfoBeforeMedia?: boolean;
  sectionLevelPage?: boolean;
  // TODO: Don't overload this, it's just for putting things in till
  // we find a pattern
  // EDIT: The comment above is 5 years old, we believe the change is simple
  // and created a ticket to address it
  // https://github.com/wellcomecollection/wellcomecollection.org/issues/10288
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
  TitleTopper,
  sectionLevelPage,
}) => {
  const Heading =
    highlightHeading && !sectionLevelPage ? (
      <HighlightedHeading text={title} />
    ) : (
      <SectionPageHeader $sectionLevelPage={sectionLevelPage ?? false}>
        {title}
      </SectionPageHeader>
    );

  const hasMedia = FeaturedMedia || HeroPicture;
  const amendedLabels = isFree ? addFreeLabel(labels) : labels;

  return (
    <>
      <Container $backgroundTexture={backgroundTexture}>
        {Background}
        <Layout
          gridSizes={
            sectionLevelPage ? gridSize12() : sectionLevelPageGridLayout
          }
        >
          <Wrapper
            $v={{
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
                $v={{
                  size: 'm',
                  properties: ['margin-top', 'margin-bottom'],
                  overrides: { large: 4 },
                }}
              >
                <Breadcrumb {...breadcrumbs} />
              </Space>
            )}
            <ConditionalWrapper
              condition={sectionLevelPage ?? false}
              wrapper={children => (
                <Space $v={{ size: 'l', properties: ['margin-top'] }}>
                  {children}
                </Space>
              )}
            >
              {TitleTopper}
              {Heading}
            </ConditionalWrapper>

            {isContentTypeInfoBeforeMedia && ContentTypeInfo && (
              <Space
                $v={{ size: 'm', properties: ['margin-bottom'] }}
                className={font('intr', 4)}
              >
                {ContentTypeInfo}
              </Space>
            )}
            {amendedLabels && amendedLabels.labels.length > 0 && (
              <LabelsList {...amendedLabels} />
            )}
          </Wrapper>
        </Layout>

        {FeaturedMedia && (
          <Layout gridSizes={gridSize10()}>
            <div style={{ position: 'relative' }}>{FeaturedMedia}</div>
          </Layout>
        )}

        {HeroPicture && (
          <div style={{ position: 'relative', height: '100%' }}>
            <HeroPictureBackground $bgColor={heroImageBgColor} />

            <HeroPictureContainer>
              <WobblyBottom backgroundColor={heroImageBgColor}>
                {HeroPicture}
              </WobblyBottom>
            </HeroPictureContainer>
          </div>
        )}
      </Container>
      {!hasMedia && !isContentTypeInfoBeforeMedia && !sectionLevelPage && (
        <WobblyEdge backgroundColor="white" />
      )}
      {!isContentTypeInfoBeforeMedia && ContentTypeInfo && (
        <Layout gridSizes={sectionLevelPageGridLayout}>
          <Space
            $v={{
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
