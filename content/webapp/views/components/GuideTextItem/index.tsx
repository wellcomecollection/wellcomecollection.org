import * as prismic from '@prismicio/client';
import { FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
import { camelize } from '@weco/common/utils/grammar';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import {
  Caption,
  Tombstone,
  TombstoneTitle,
  CaptionTranscription as Wrapper,
} from '@weco/content/views/components/ExhibitionCaptions/ExhibitionCaptions.Stop';

const GuideTextItem: FunctionComponent<{
  number: number | undefined;
  title: string;
  tombstone?: prismic.RichTextField;
  caption?: prismic.RichTextField;
  additionalNotes?: prismic.RichTextField;
  transcript?: prismic.RichTextField;
}> = ({ number, title, tombstone, caption, additionalNotes, transcript }) => {
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

            {transcript && (
              <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
                <CollapsibleContent
                  id={number ? `${number}` : camelize(title)}
                  controlText={{ defaultText: 'Read transcript' }}
                >
                  <PrismicHtmlBlock html={transcript} />
                </CollapsibleContent>
              </Space>
            )}
          </Wrapper>
        )}
      </Container>
    </Space>
  );
};

export default GuideTextItem;
