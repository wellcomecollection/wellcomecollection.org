import { FunctionComponent } from 'react';
import Caption from '@weco/common/views/components/Caption/Caption';
import * as prismic from '@prismicio/client';
import styled from 'styled-components';

const Figure = styled.figure`
  margin: 0;

  iframe {
    border: 0;
  }
`;

export type Props = {
  embedUrl: string;
  caption?: prismic.RichTextField;
};

const SoundCloudEmbed: FunctionComponent<Props> = ({ embedUrl, caption }) => (
  <Figure>
    <iframe
      width="100%"
      height="140"
      title="soundcloud player"
      src={embedUrl}
    />
    {caption && <Caption caption={caption} />}
  </Figure>
);

export default SoundCloudEmbed;
