import * as prismic from '@prismicio/client';
import { FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import {
  Caption,
  Tombstone,
  TombstoneTitle,
  CaptionTranscription as Wrapper,
} from '@weco/content/components/ExhibitionCaptions/ExhibitionCaptions.Stop';

const GuideTextItem: FunctionComponent<{
  number: number | undefined;
  title: string;
  tombstone?: prismic.RichTextField;
  caption?: prismic.RichTextField;
  additionalNotes?: prismic.RichTextField;
}> = ({ number, title, tombstone, caption, additionalNotes }) => {
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

        {(caption || additionalNotes) && (
          <Wrapper>
            {additionalNotes && <PrismicHtmlBlock html={additionalNotes} />}
            {caption && (
              <Caption>
                <PrismicHtmlBlock html={caption} />
              </Caption>
            )}
          </Wrapper>
        )}
      </Container>
    </Space>
  );
};

export default GuideTextItem;
