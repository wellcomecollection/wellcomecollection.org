import {
  ComponentProps,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import AccessibilityProvision from '@weco/common/views/components/AccessibilityProvision';
import Breadcrumb from '@weco/common/views/components/Breadcrumb';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import LabelsList from '@weco/common/views/components/LabelsList';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
} from '@weco/common/views/components/Layout';
import { Picture } from '@weco/common/views/components/Picture';
import Space from '@weco/common/views/components/styled/Space';
import {
  WobblyBottom,
  WobblyEdge,
} from '@weco/common/views/components/WobblyEdge';

import { BackgroundType, FeaturedMedia, pageGridLayout } from '.';
import {
  Container,
  HeroPictureBackground,
  HeroPictureContainer,
  TitleWrapper,
  Wrapper,
} from './PageHeader.styles';

const Heading = styled(Space)`
  background-color: ${props => props.theme.color('white')};
  display: inline;
  line-height: calc(1.1em + 12px);
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
`;

const HighlightedHeading: FunctionComponent<{ text: string }> = ({
  text,
}: {
  text: string;
}) => {
  return (
    <h1 className={font('wb', 2)}>
      <Heading
        $v={{
          size: 's',
          properties: ['padding-top', 'padding-bottom'],
        }}
        $h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
      >
        {text}
      </Heading>
    </h1>
  );
};

export type Props = {
  title: string;
  breadcrumbs?: ComponentProps<typeof Breadcrumb>;
  amendedLabels?: ComponentProps<typeof LabelsList>;
  ContentTypeInfo?: ReactNode;
  Background?: BackgroundType;
  FeaturedMedia?: FeaturedMedia;
  HeroPicture?: ReactElement<typeof Picture>;
  isContentTypeInfoBeforeMedia?: boolean;
  heroImageBgColor?: 'warmNeutral.300' | 'white';
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
  heroImageBgColor = 'white',
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

  // As <Breadcrumb> will automatically add "Home" as the first breadcrumb unless "noHomeLink" is true
  // This checks whether or not there are actually any items.
  const hasBreadcrumbItems =
    breadcrumbs &&
    (breadcrumbs.items.length > 0 ||
      !(breadcrumbs.items.length === 0 && breadcrumbs.noHomeLink));

  return (
    <>
      <Container $backgroundTexture={backgroundTexture}>
        {Background}
        <ContaineredLayout
          gridSizes={fullWidth ? gridSize12() : pageGridLayout}
        >
          <Wrapper
            $v={{
              size: isSlim ? 'xs' : 'l',
              properties:
                isContentTypeInfoBeforeMedia || hasMedia
                  ? ['margin-bottom']
                  : ['margin-bottom', 'padding-bottom'],
            }}
          >
            {hasBreadcrumbItems && (
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
              condition={!hasBreadcrumbItems}
              wrapper={children => (
                <Space $v={{ size: 'l', properties: ['margin-top'] }}>
                  {children}
                </Space>
              )}
            >
              {SerialPartNumber}
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

      {!hasMedia && !isContentTypeInfoBeforeMedia && !isSlim && (
        <WobblyEdge backgroundColor="white" />
      )}

      {!isContentTypeInfoBeforeMedia && ContentTypeInfo && (
        <ContaineredLayout gridSizes={pageGridLayout}>
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

export default BasicPageHeader;
