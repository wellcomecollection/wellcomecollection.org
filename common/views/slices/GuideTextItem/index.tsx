import { Content } from '@prismicio/client';
import { FunctionComponent } from 'react';
import { SliceComponentProps } from '@prismicio/react';
import { transformGuideTextItemSlice } from '@weco/content/services/prismic/transformers/exhibition-texts';

import * as prismic from '@prismicio/client';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import {
  TombstoneTitle,
  Tombstone,
  CaptionTranscription as CaptionWrapper,
  Caption,
} from '@weco/content/components/ExhibitionCaptions/ExhibitionCaptions.Stop';

const TextItem: FunctionComponent<{
  number: number | undefined;
  title: string;
  tombstone?: prismic.RichTextField;
  caption?: prismic.RichTextField;
}> = ({ number, title, tombstone, caption }) => {
  return (
    <Space
      id={number ? `stop-${number}` : undefined}
      as="article"
      $v={{ size: 'xl', properties: ['margin-bottom'] }}
    >
      <Container style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Tombstone>
          {title && <TombstoneTitle $level={3}>{title}</TombstoneTitle>}
          {tombstone && (
            <div className={font('intr', 4)}>
              <PrismicHtmlBlock html={tombstone} />
            </div>
          )}
        </Tombstone>

        {caption && (
          <CaptionWrapper>
            <Caption>
              <PrismicHtmlBlock html={caption} />
            </Caption>
          </CaptionWrapper>
        )}
      </Container>
    </Space>
  );
};

export type GuideTextItemProps =
  SliceComponentProps<Content.GuideTextItemSlice>;

const GuideTextItem: FunctionComponent<GuideTextItemProps> = ({
  slice,
  index,
}) => {
  const transformedSlice = transformGuideTextItemSlice(slice);

  return (
    <TextItem
      key={index}
      number={transformedSlice.number}
      title={transformedSlice.title}
      tombstone={transformedSlice.tombstone}
      caption={transformedSlice.caption}
    />
  );
};

export default GuideTextItem;
