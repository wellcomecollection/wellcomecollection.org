// @flow
import {font, spacing} from '../../../utils/classnames';
import Icon from '../Icon/Icon';

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
      <figcaption className={`inline-flex font-black plain-text ${font({s: 'LR3', m: 'LR2'})} ${spacing({s: 3}, {padding: ['top', 'bottom']})}`}>
        <Icon name='image' extraClasses='float-l margin-right-s1' />
        <div className={`overflow-hidden ${spacing({s: 3, m: 4, l: 5}, {padding: ['right']})}`}>
          <span dangerouslySetInnerHTML={{__html: caption}} />
        </div>
      </figcaption>
    }
  </figure>
);

export default VideoEmbed;
