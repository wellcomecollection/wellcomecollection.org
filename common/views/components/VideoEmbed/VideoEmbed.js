// @flow
import Caption from '../Caption/Caption';

type Props = {|
  embedUrl: string,
  caption?: string
|}

const VideoEmbed = ({ embedUrl, caption }: Props) => (
  <figure className='no-margin'>
    <div className='iframe-container relative'>
      <iframe
        allowFullScreen='allowfullscreen'
        mozallowfullscreen='mozallowfullscreen'
        msallowfullscreen='msallowfullscreen'
        oallowfullscreen='oallowfullscreen'
        webkitallowfullscreen='webkitallowfullscreen'
        src={embedUrl}
        frameBorder='0'
        className='iframe-container__iframe absolute'></iframe>
    </div>
    {caption &&
      <Caption caption={caption} />
    }
  </figure>
);

export default VideoEmbed;
