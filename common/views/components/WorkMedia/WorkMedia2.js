// @flow
import {grid, font, spacing} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import ImageViewer2 from '../ImageViewer/ImageViewer2';
import LinkControl from '../Buttons/LinkControl/LinkControl';
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
              <a className={`
                  flex-inline flex-v-center plain-link font-green font-hover-turquoise
                  ${font({s: 'HNM4'})}
                  ${spacing({s: 1}, {margin: ['top', 'bottom']})}
                `}
              href={href(queryString, id)}
              data-track-event={tracking(queryString, id, trackTitle)}>
                <Icon name='arrow' extraClasses='icon--green icon--180' />
                <span className={spacing({s: 1}, {margin: ['left']})}>Search results</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      }
      <div id={`work-media-${id}`} className='row bg-black work-media js-work-media'>
        <LinkControl
          extraClasses='scroll-to-info js-scroll-to-info js-work-media-control flush-container-right button-control--dark'
          url='#work-info'
          eventTracking='{"category": "component", "action": "scroll-to-info:click", "label": "scrolled-to-id:work-info"}`}'
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
