import { FunctionComponent } from 'react';
import Caption from '@weco/common/views/components/Caption/Caption';
import { HTMLString } from '@weco/common/services/prismic/types';
import { IframeContainer } from '@weco/common/views/components/Iframe/Iframe';

type Props = {
  embedUrl: string;
  caption?: HTMLString;
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
