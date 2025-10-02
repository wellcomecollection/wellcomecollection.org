// All landings are to use this moving forward
// https://github.com/wellcomecollection/wellcomecollection.org/pull/12253
import * as prismic from '@prismicio/client';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { defaultSerializer } from '@weco/common/views/components/HTMLSerializers';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';

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
};

const SimpleLandingPageHeader: FunctionComponent<Props> = ({
  title,
  introText,
}) => {
  return (
    <ContaineredLayout gridSizes={gridSize12()}>
      <Wrapper $v={{ size: 'xl', properties: ['margin-bottom', 'margin-top'] }}>
        <TitleWrapper $sectionLevelPage>{title}</TitleWrapper>

        {introText && introText.length > 0 && (
          <Grid>
            <GridCell $sizeMap={{ s: [12], m: [10], l: [8], xl: [7] }}>
              <Space
                $v={{ size: 's', properties: ['margin-top'] }}
                className={font('intr', 2)}
              >
                <ContentWrapper>
                  <PrismicHtmlBlock
                    html={introText}
                    htmlSerializer={defaultSerializer}
                  />
                </ContentWrapper>
              </Space>
            </GridCell>
          </Grid>
        )}
      </Wrapper>
    </ContaineredLayout>
  );
};

export default SimpleLandingPageHeader;
