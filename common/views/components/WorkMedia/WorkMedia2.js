// @flow
import {grid} from '../../../utils/classnames';
import ImageViewer2 from '../ImageViewer/ImageViewer2';
import Control from '../Buttons/Control/Control';
import SecondaryLink from '../Links/SecondaryLink/SecondaryLink';
import {iiifImageTemplate} from '../../../utils/convert-image-uri';

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
  return `{
    "category": "component",
    "action": "return-to-results:click",
    "label": "id:${id}, query:${queryString}, title:${trackTitle}"
  }`;
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
                eventTracking={tracking(queryString, id, trackTitle)} />
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
          eventTracking={`${JSON.stringify({
            category: 'component',
            action: 'scroll-to-info:click',
            label: 'scrolled-to-id:work-info'
          })}`}
          icon='chevron'
          text='Scroll to info' />

        <ImageViewer2
          contentUrl={imageContentUrl}
          id={id}
          width={width}
          trackTitle={trackTitle}
        />

      </div>
    </div>
  );
};

export default WorkMedia;
