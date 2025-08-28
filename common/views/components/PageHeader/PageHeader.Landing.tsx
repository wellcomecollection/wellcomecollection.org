import {
  ComponentProps,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';

import { font } from '@weco/common/utils/classnames';
import AccessibilityProvision from '@weco/common/views/components/AccessibilityProvision';
import LabelsList from '@weco/common/views/components/LabelsList';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
} from '@weco/common/views/components/Layout';
import { Picture } from '@weco/common/views/components/Picture';
import Space from '@weco/common/views/components/styled/Space';
import { WobblyBottom } from '@weco/common/views/components/WobblyEdge';

import { BackgroundType, FeaturedMedia, pageGridLayout } from '.';
import {
  Container,
  HeroPictureBackground,
  HeroPictureContainer,
  TitleWrapper,
  Wrapper,
} from './PageHeader.styles';

export type Props = {
  title: string;
  amendedLabels?: ComponentProps<typeof LabelsList>;
  ContentTypeInfo?: ReactNode;
  Background?: BackgroundType;
  HeroPicture?: ReactElement<typeof Picture>;
  FeaturedMedia?: FeaturedMedia;
  isContentTypeInfoBeforeMedia?: boolean;
  heroImageBgColor?: 'warmNeutral.300' | 'white';
  backgroundTexture?: string;
  SerialPartNumber?: ReactNode;
  isSlim?: boolean;
  includeAccessibilityProvision?: boolean;
};

const LandingPageHeader: FunctionComponent<Props> = ({
  title,
  amendedLabels,
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
  isSlim,
  includeAccessibilityProvision,
}) => {
  return (
    <>
      <Container $backgroundTexture={backgroundTexture}>
        {Background}
        <ContaineredLayout gridSizes={gridSize12()}>
          <Wrapper
            $v={{
              size: isSlim ? 'xs' : 'l',
              properties: ['margin-bottom'],
            }}
          >
            <Space $v={{ size: 'l', properties: ['margin-top'] }}>
              {SerialPartNumber}
              <TitleWrapper $sectionLevelPage>{title}</TitleWrapper>
            </Space>

            {isContentTypeInfoBeforeMedia && ContentTypeInfo && (
              <Space
                $v={{ size: 'm', properties: ['margin-bottom'] }}
                className={font('intr', 4)}
              >
                {ContentTypeInfo}
              </Space>
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
              }}
            >
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

export default LandingPageHeader;
