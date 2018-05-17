// @flow

type Props = {| embedUrl: string |}

const VideoEmbed = ({ embedUrl }: Props) => (
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
);

export default VideoEmbed;
