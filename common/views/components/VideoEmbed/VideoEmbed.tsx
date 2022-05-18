import { FunctionComponent } from 'react';
import Caption from '../Caption/Caption';
import { IframeContainer } from '../Iframe/Iframe';
import * as prismicT from '@prismicio/types';

export type Props = {
  embedUrl: string;
  caption?: prismicT.RichTextField;
};

const VideoEmbed: FunctionComponent<Props> = ({ embedUrl, caption }: Props) => (
  <figure className="no-margin">
    <IframeContainer>
      <iframe
        className="iframe"
        title="Video"
        allowFullScreen={true}
        src={`${embedUrl}&enablejsapi=1`}
        frameBorder="0"
      />
    </IframeContainer>
    {caption && <Caption caption={caption} />}
  </figure>
);

export default VideoEmbed;
