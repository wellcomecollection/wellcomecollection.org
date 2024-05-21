import { Content } from '@prismicio/client';
import { FunctionComponent } from 'react';
import { SliceComponentProps } from '@prismicio/react';
import { transformGuideSectionHeadingSlice } from '@weco/content/services/prismic/transformers/exhibition-texts';

import * as prismic from '@prismicio/client';
import Space from '@weco/common/views/components/styled/Space';
import { Container } from '@weco/common/views/components/styled/Container';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import {
  StandaloneTitle as Title,
  Tombstone as Spacer,
  ContextTitle as Subtitle,
  ContextContainer as Background,
  CaptionTranscription as TextWrapper,
} from '@weco/content/components/ExhibitionCaptions/ExhibitionCaptions.Stop';

const SectionHeading: FunctionComponent<{
  index: number;
  number: number | undefined;
  title: string;
  subtitle: string;
  text: prismic.RichTextField | undefined;
}> = ({ index, number, title, subtitle, text }) => {
  return (
    <div id={number ? `stop-${number}` : undefined}>
      <Container>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Spacer />
          <Space
            $h={{ size: 'm', properties: ['margin-left'], negative: true }}
            $v={{ size: 'l', properties: ['margin-bottom'] }}
          >
            <Title>{title}</Title>
          </Space>
        </div>
      </Container>

      <Space as="article" $v={{ size: 'xl', properties: ['margin-bottom'] }}>
        <Background
          $backgroundColor={index === 0 ? 'white' : 'warmNeutral.300'}
          $hasPadding={!(index === 0)}
        >
          <Container style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Spacer />
            <TextWrapper>
              {subtitle && subtitle.length > 0 && (
                <Subtitle $level={3}>{subtitle}</Subtitle>
              )}
              {text && <PrismicHtmlBlock html={text} />}
            </TextWrapper>
          </Container>
        </Background>
      </Space>
    </div>
  );
};

export type GuideSectionHeadingProps =
  SliceComponentProps<Content.GuideSectionHeadingSlice>;

const GuideSectionHeading: FunctionComponent<GuideSectionHeadingProps> = ({
  slice,
  index,
}) => {
  const transformedSlice = transformGuideSectionHeadingSlice(slice);
  return (
    <SectionHeading
      key={index}
      index={index}
      number={transformedSlice.number}
      title={transformedSlice.title}
      subtitle={transformedSlice.subtitle}
      text={transformedSlice.text}
    />
  );
};

export default GuideSectionHeading;
