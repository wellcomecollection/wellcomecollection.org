// All landings are to use this moving forward
// https://github.com/wellcomecollection/wellcomecollection.org/pull/12253
import * as prismic from '@prismicio/client';
import { FunctionComponent } from 'react';

import { defaultSerializer } from '@weco/common/views/components/HTMLSerializers';
import {
  ContaineredLayout,
  gridSize12,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';

import { TitleWrapper, Wrapper } from './PageHeader.styles';

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
      <Wrapper $v={{ size: 'l', properties: ['margin-bottom'] }}>
        <Space $v={{ size: 'l', properties: ['margin-top'] }}>
          <TitleWrapper $sectionLevelPage>{title}</TitleWrapper>
        </Space>

        {introText && introText.length > 0 && (
          <ContaineredLayout gridSizes={gridSize8(false)}>
            <div className="body-text spaced-text">
              <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
                <PrismicHtmlBlock
                  html={introText}
                  htmlSerializer={defaultSerializer}
                />
              </Space>
            </div>
          </ContaineredLayout>
        )}
      </Wrapper>
    </ContaineredLayout>
  );
};

export default SimpleLandingPageHeader;
