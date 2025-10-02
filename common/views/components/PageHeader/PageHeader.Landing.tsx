// All landings are to use this moving forward
// https://github.com/wellcomecollection/wellcomecollection.org/pull/12253
import * as prismic from '@prismicio/client';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { defaultSerializer } from '@weco/common/views/components/HTMLSerializers';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';

import { FeaturedMedia } from '.';
import { TitleWrapper, Wrapper } from './PageHeader.styles';

const ContentWrapper = styled(Space).attrs({
  $v: { size: 's', properties: ['margin-top'] },
  className: font('intr', 2),
})`
  p:last-child {
    margin-bottom: 0;
  }
`;

export type Props = {
  title: string;
  introText?: prismic.RichTextField;
  FeaturedMedia?: FeaturedMedia;
};

const LandingPageHeader: FunctionComponent<Props> = ({
  title,
  introText,
  FeaturedMedia,
}) => {
  return (
    <>
      <ContaineredLayout gridSizes={gridSize12()}>
        <Wrapper
          $v={{ size: 'xl', properties: ['margin-bottom', 'margin-top'] }}
        >
          <TitleWrapper $isOfficialLandingPage>{title}</TitleWrapper>

          {introText && introText.length > 0 && (
            <Grid>
              <GridCell $sizeMap={{ s: [12], m: [10], l: [8], xl: [7] }}>
                <ContentWrapper>
                  <PrismicHtmlBlock
                    html={introText}
                    htmlSerializer={defaultSerializer}
                  />
                </ContentWrapper>
              </GridCell>
            </Grid>
          )}
        </Wrapper>
      </ContaineredLayout>

      {FeaturedMedia && (
        <ContaineredLayout gridSizes={gridSize10()}>
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            <div style={{ position: 'relative' }}>{FeaturedMedia}</div>
          </Space>
        </ContaineredLayout>
      )}
    </>
  );
};

export default LandingPageHeader;
