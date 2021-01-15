import { FunctionComponent } from 'react';
import Caption from '../Caption/Caption';
import { HTMLString } from '../../../services/prismic/types';

type Props = {
  embedUrl: string;
  caption?: HTMLString;
};

const VideoEmbed: FunctionComponent<Props> = ({ embedUrl, caption }: Props) => (
  <figure className="no-margin">
    <div className="iframe-container relative">
      <iframe
        title="Video"
        allowFullScreen={true}
        src={`${embedUrl}&enablejsapi=1`}
        frameBorder="0"
        className="iframe-container__iframe absolute"
      />
    </div>
    {caption && <Caption caption={caption} />}
  </figure>
);

export default VideoEmbed;
