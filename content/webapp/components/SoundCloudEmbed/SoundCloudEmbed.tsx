import { FunctionComponent } from 'react';
import styled from 'styled-components';
import * as prismic from '@prismicio/client';
import Caption from '@weco/common/views/components/Caption/Caption';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';

const Figure = styled.figure`
  margin: 0;

  iframe {
    border: 0;
  }
`;

export type Props = {
  index: number;
  embedUrl: string;
  caption?: prismic.RichTextField;
  transcript?: prismic.RichTextField;
};

const SoundCloudEmbed: FunctionComponent<Props> = ({
  index,
  embedUrl,
  caption,
  transcript,
}) => {
  return (
    <Figure>
      <iframe
        width="100%"
        height="140"
        title="soundcloud player"
        src={embedUrl}
      />
      {caption && <Caption caption={caption} />}

      {transcript && (
        <CollapsibleContent
          id={`embedSoundCloudTranscript-${index}`}
          controlText={{
            contentShowingText: 'Hide the transcript',
            defaultText: 'Show the transcript',
          }}
        >
          <PrismicHtmlBlock html={transcript} />
        </CollapsibleContent>
      )}
    </Figure>
  );
};

export default SoundCloudEmbed;
