import {
  ComponentProps,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';

import { useKiosk } from '@weco/common/contexts/KioskContext';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { typography } from '@weco/common/utils/classnames';
import AccessibilityProvision from '@weco/common/views/components/AccessibilityProvision';
import Breadcrumb from '@weco/common/views/components/Breadcrumb';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import DecorativeEdge, {
  WobblyBottom,
} from '@weco/common/views/components/DecorativeEdge';
import LabelsList from '@weco/common/views/components/LabelsList';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
} from '@weco/common/views/components/Layout';
import { Picture } from '@weco/common/views/components/Picture';
import Space from '@weco/common/views/components/styled/Space';
import { pageBackgroundColor } from '@weco/common/views/themes/config';

import { BackgroundType, FeaturedMedia, pageGridLayout } from '.';
import {
  Container,
  HeroPictureBackground,
  HeroPictureContainer,
  TitleWrapper,
  Wrapper,
} from './PageHeader.styles';

// The title takes the colour the header's `Wrapper` sets (light on a dark
// header, dark otherwise)
const HighlightedHeading: FunctionComponent<{ text: string }> = ({ text }) => (
  <h1 className={typography('heading', 'xl', 'strong', 'brand')}>{text}</h1>
);

export type Props = {
  title: string;
  breadcrumbs?: ComponentProps<typeof Breadcrumb>;
  amendedLabels?: ComponentProps<typeof LabelsList>;
  ContentTypeInfo?: ReactNode;
  Background?: BackgroundType;
  FeaturedMedia?: FeaturedMedia;
  HeroPicture?: ReactElement<typeof Picture>;
  isContentTypeInfoBeforeMedia?: boolean;
  heroImageBgColor?: 'warmNeutral.300' | typeof pageBackgroundColor;
  backgroundTexture?: string;
  highlightHeading?: boolean;
  SerialPartNumber?: ReactNode;
  isSlim?: boolean;
  fullWidth?: boolean;
  includeAccessibilityProvision?: boolean;
};

const BasicPageHeader: FunctionComponent<Props> = ({
  title,
  breadcrumbs,
  amendedLabels,
  ContentTypeInfo,
  Background,
  FeaturedMedia,
  HeroPicture,
  isContentTypeInfoBeforeMedia = false,
  // Not a massive fan of this, but it feels overkill to make a new component
  // for it as it's only used on articles and exhibitions
  heroImageBgColor = pageBackgroundColor,
  backgroundTexture,
  highlightHeading,
  SerialPartNumber,
  isSlim,
  fullWidth,
  includeAccessibilityProvision,
}) => {
  const Heading = highlightHeading ? (
    <HighlightedHeading text={title} />
  ) : (
    <TitleWrapper>{title}</TitleWrapper>
  );

  const hasMedia = FeaturedMedia || HeroPicture;
  const { isKiosk } = useKiosk();

  // The Background stops short so media can overlap its bottom edge. Without
  // media, that leaves the brand's light text on the page, so texture the whole
  // header instead (as guides do).
  const isTexturingWholeHeader = !!Background && !hasMedia;
  const containerTexture = isTexturingWholeHeader
    ? backgroundTexture || headerBackgroundLs
    : backgroundTexture;

  // Not rendering the Background also drops the wobbly edge it draws, so show
  // the header's own edge instead, with room for it below the content
  const hasBottomEdge =
    !hasMedia &&
    !isSlim &&
    (!isContentTypeInfoBeforeMedia || isTexturingWholeHeader);
  const hasBottomPadding =
    hasBottomEdge || (!hasMedia && !isContentTypeInfoBeforeMedia);

  // As <Breadcrumb> will automatically add "Home" as the first breadcrumb unless "noHomeLink" is true,
  // this checks whether or not there are actually any visible items.
  const hasBreadcrumbItems =
    !isKiosk &&
    breadcrumbs &&
    (!breadcrumbs.noHomeLink || breadcrumbs.items.some(item => !item.isHidden));

  return (
    <>
      <Container $backgroundTexture={containerTexture}>
        {!isTexturingWholeHeader && Background}
        <ContaineredLayout
          gridSizes={fullWidth ? gridSize12() : pageGridLayout}
        >
          <Wrapper
            // Textured headers are dark
            $isOnDarkHeader={!!(Background || backgroundTexture)}
            $v={{
              size: isSlim ? '2xs' : 'md',
              properties: hasBottomPadding
                ? ['margin-bottom', 'padding-bottom']
                : ['margin-bottom'],
            }}
          >
            {hasBreadcrumbItems && (
              // We need to keep some space below the breadcrumbs to prevent
              // 'highlighted' headings from being partially concealed
              <Space
                $v={{
                  size: 'sm',
                  properties: ['margin-top', 'margin-bottom'],
                  overrides: { md: '150' },
                }}
              >
                <Breadcrumb {...breadcrumbs} />
              </Space>
            )}

            <ConditionalWrapper
              condition={!hasBreadcrumbItems}
              wrapper={children => (
                <Space $v={{ size: 'lg', properties: ['margin-top'] }}>
                  {children}
                </Space>
              )}
            >
              {SerialPartNumber}
              {Heading}
            </ConditionalWrapper>

            {isContentTypeInfoBeforeMedia && ContentTypeInfo && (
              <Space
                $v={{ size: 'sm', properties: ['margin-bottom'] }}
                className={typography('body', 'lg', 'regular')}
              >
                {ContentTypeInfo}
              </Space>
            )}

            <div style={{ display: 'flex', alignItems: 'end' }}>
              {amendedLabels && amendedLabels.labels.length > 0 && (
                <LabelsList {...amendedLabels} />
              )}

              {includeAccessibilityProvision && (
                <div style={{ marginLeft: 'auto' }}>
                  <AccessibilityProvision showText={false} />
                </div>
              )}
            </div>
          </Wrapper>
        </ContaineredLayout>

        {FeaturedMedia && (
          <ContaineredLayout gridSizes={gridSize10()}>
            <div style={{ position: 'relative' }}>{FeaturedMedia}</div>
          </ContaineredLayout>
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

      {hasBottomEdge && (
        <DecorativeEdge
          variant="wobbly"
          backgroundColor={pageBackgroundColor}
        />
      )}

      {!isContentTypeInfoBeforeMedia && ContentTypeInfo && (
        <ContaineredLayout gridSizes={pageGridLayout}>
          <Space
            $v={{ size: 'md', properties: ['margin-top'] }}
            className={typography('body', 'lg', 'strong')}
          >
            {ContentTypeInfo}
          </Space>
        </ContaineredLayout>
      )}
    </>
  );
};

export default BasicPageHeader;
