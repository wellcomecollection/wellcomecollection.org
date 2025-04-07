import {
  ComponentProps,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import AccessibilityProvision from '@weco/common/views/components/AccessibilityProvision/AccessibilityProvision';
import Breadcrumb from '@weco/common/views/components/Breadcrumb/Breadcrumb';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
} from '@weco/common/views/components/Layout';
import { Picture } from '@weco/common/views/components/Picture/Picture';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import {
  WobblyBottom,
  WobblyEdge,
} from '@weco/common/views/components/WobblyEdge';
import { PaletteColor } from '@weco/common/views/themes/config';

import { SectionPageHeader } from './PageHeader';

const PageHeaderContainer = styled.div<{
  $backgroundTexture?: string;
  $hasBackgroundColor?: boolean;
}>`
  position: relative;
  background-image: ${props =>
    props.$backgroundTexture
      ? `url(${props.$backgroundTexture})`
      : 'undefined'};
  background-size: ${props =>
    props.$backgroundTexture ? 'cover' : 'undefined'};
  background-color: ${props =>
    props.$hasBackgroundColor
      ? props.theme.color('warmNeutral.300')
      : 'undefined'};
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

function addFreeLabel(labelListProps) {
  const freeLabel = {
    text: 'Free',
    labelColor: 'black',
    textColor: 'white',
  };
  const labels = [freeLabel, ...(labelListProps?.labels ?? [])];
  return { ...(labelListProps ?? {}), labels };
}

export type FeaturedMedia =
  | ReactElement<typeof PrismicImage>
  | ReactElement<typeof VideoEmbed>
  | ReactElement<typeof Picture>;

type BackgroundType = ReactElement<typeof HeaderBackground>;

type Props = {
  title: string;
  breadcrumbs: ComponentProps<typeof Breadcrumb>;
  labels?: ComponentProps<typeof LabelsList>;
  ContentTypeInfo?: ReactNode;
  Background?: BackgroundType;
  FeaturedMedia?: FeaturedMedia;
  HeroPicture?: ReactElement<typeof Picture>;
  heroImageBgColor?: 'warmNeutral.300' | 'white';
  backgroundTexture?: string;
  isContentTypeInfoBeforeMedia?: boolean;
  SerialPartNumber?: ReactNode;
  sectionLevelPage?: boolean;

  displayFreeLabel?: boolean;
  isSlim?: boolean;
  fullWidth?: boolean;
  includeAccessibilityProvision?: boolean;
};

const sectionLevelPageGridLayout = { s: 12, m: 12, l: 10, xl: 10 };
const NewPageHeader: FunctionComponent<Props> = ({
  breadcrumbs,
  labels,
  title,
  ContentTypeInfo,
  Background,
  HeroPicture,
  FeaturedMedia,
  isContentTypeInfoBeforeMedia = false,
  // Not a massive fan of this, but it feels overkill to make a new component
  // for it as it's only used on articles and exhibitions
  heroImageBgColor = 'white',
  backgroundTexture,
  SerialPartNumber,
  displayFreeLabel,
  sectionLevelPage,
  isSlim,
  fullWidth,
  includeAccessibilityProvision,
}) => {
  const hasMedia = FeaturedMedia || HeroPicture;
  const amendedLabels = displayFreeLabel ? addFreeLabel(labels) : labels;

  // As <Breadcrumb> will automatically add "Home" as the first breadcrumb unless "noHomeLink" is true
  // This checks whether or not there are actually any items.
  const hasBreadcrumbItems =
    breadcrumbs.items.length > 0 ||
    !(breadcrumbs.items.length === 0 && breadcrumbs.noHomeLink);

  return (
    <>
      <PageHeaderContainer $backgroundTexture={backgroundTexture}>
        {Background}
        <ContaineredLayout
          gridSizes={
            sectionLevelPage || fullWidth
              ? gridSize12()
              : sectionLevelPageGridLayout
          }
        >
          <Wrapper
            $v={{
              size: isSlim ? 'xs' : 'l',
              properties:
                isContentTypeInfoBeforeMedia || hasMedia || sectionLevelPage
                  ? ['margin-bottom']
                  : ['margin-bottom', 'padding-bottom'],
            }}
          >
            {!sectionLevelPage && hasBreadcrumbItems && (
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
              condition={sectionLevelPage || !hasBreadcrumbItems}
              wrapper={children => (
                <Space $v={{ size: 'l', properties: ['margin-top'] }}>
                  {children}
                </Space>
              )}
            >
              {SerialPartNumber}

              <SectionPageHeader $sectionLevelPage={sectionLevelPage ?? false}>
                {title}
              </SectionPageHeader>
            </ConditionalWrapper>

            {isContentTypeInfoBeforeMedia && ContentTypeInfo && (
              <Space
                $v={{ size: 'm', properties: ['margin-bottom'] }}
                className={font('intr', 4)}
              >
                {ContentTypeInfo}
              </Space>
            )}

            <div style={{ display: 'flex', alignItems: 'end' }}>
              {!!amendedLabels?.labels?.length && (
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
      </PageHeaderContainer>

      {!hasMedia &&
        !isContentTypeInfoBeforeMedia &&
        !sectionLevelPage &&
        !isSlim && <WobblyEdge backgroundColor="white" />}

      {!isContentTypeInfoBeforeMedia && ContentTypeInfo && (
        <ContaineredLayout gridSizes={sectionLevelPageGridLayout}>
          <Space
            $v={{ size: 'l', properties: ['margin-top'] }}
            className={font('intb', 4)}
          >
            {ContentTypeInfo}
          </Space>
        </ContaineredLayout>
      )}
    </>
  );
};

export default NewPageHeader;
