// @flow
import {grid} from '../../../utils/classnames';
import Image from '../Image/Image';
import ImageViewer from '../ImageViewer/ImageViewer';
import SecondaryLink from '../Links/SecondaryLink/SecondaryLink';
import {iiifImageTemplate} from '../../../utils/convert-image-uri';
import Control from '../Buttons/Control/Control';

type Props = {|
  id: string,
  title: string,
  iiifUrl: string,
  width?: number,
  queryString?: string,
|}

const href = (queryString, id) => {
  return `/works${queryString}#${id}`;
};

const tracking = (queryString, id, trackTitle) => {
  return {
    category: 'component',
    action: 'return-to-results:click',
    label: `id:${id}, query:${queryString}, title:${trackTitle}`
  };
};

const WorkMedia = ({
  id,
  title,
  iiifUrl,
  width = 800,
  queryString
}: Props) => {
  const trackTitle = title.substring(0, 50);
  const imageContentUrl = iiifImageTemplate(iiifUrl)({ size: `${width},` });
  return (
    <div>
      {queryString &&
      <div className='row is-hidden-s is-hidden-m'>
        <div className='container'>
          <div className='grid'>
            <div className={grid({s: 12})}>
              <SecondaryLink
                url={href(queryString, id)}
                text='Search results'
                trackingEvent={tracking(queryString, id, trackTitle)} />
            </div>
          </div>
        </div>
      </div>
      }
      <div id={`work-media-${id}`} className='row bg-black work-media js-work-media'>
        <Control
          type='dark'
          extraClasses='scroll-to-info js-scroll-to-info js-work-media-control flush-container-right'
          url='#work-info'
          trackingEvent={{
            category: 'component',
            action: 'scroll-to-info:click',
            label: 'scrolled-to-id:work-info'
          }}
          icon='chevron'
          text='Scroll to info' />
        <div className='work-media__image-container'>
          <Image
            width={width}
            contentUrl={imageContentUrl}
            lazyload={true}
            sizesQueries='(min-width: 860px) 800px, calc(92.59vw + 22px)'
            alt='' />
        </div>

        <ImageViewer
          imageUrl={imageContentUrl}
          id={id}
          trackTitle={trackTitle} />
      </div>
    </div>
  );
};

export default WorkMedia;
