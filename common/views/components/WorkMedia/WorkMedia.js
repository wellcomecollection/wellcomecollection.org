// @flow
import urlTemplate from 'url-template';
import {grid, font, spacing} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import Image from '../Image/Image';
import ImageViewer from '../ImageViewer/ImageViewer';
import ScrollToInfo from '../ScrollToInfo/ScrollToInfo';

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

function iiifImage(infoJsonLocation: string) {
  const baseUrl = infoJsonLocation.replace('/info.json', '');
  const templateString = `${baseUrl}/{region}/{size}/{rotation}/{quality}.{format}`;
  const defaultOpts = {
    region: 'full',
    size: 'full',
    rotation: 0,
    quality: 'default',
    format: 'jpg'
  };
  const template = urlTemplate.parse(templateString);
  return (opts) => template.expand(Object.assign({}, defaultOpts, opts));
}

const WorkMedia = ({
  id,
  title,
  iiifUrl,
  width = 800,
  queryString
}: Props) => {
  const trackTitle = title.substring(0, 50);
  const imageContentUrl = iiifImage(iiifUrl)({ size: `${width},` });
  return (
    <div>
      {queryString &&
      <div className="row is-hidden-s is-hidden-m">
        <div className="container">
          <div className="grid">
            <div className={grid({s: 12})}>
              <a className={`
                  flex-inline flex-v-center plain-link font-elf-green font-hover-mint
                  ${font({s: 'HNM4'})}
                  ${spacing({s: 1}, {margin: ['top', 'bottom']})}
                `}
              href={href(queryString, id)}
              data-track-event={tracking(queryString, id, trackTitle)}>
                <Icon name='arrow' extraClasses={['icon--elf-green', 'icon--180']} />
                <span className={spacing({s: 1}, {margin: ['left']})}>Search results</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      }
      <div id={`work-media-${id}`} className="row bg-charcoal work-media js-work-media">
        <div className="pointer-events-none">
          <ScrollToInfo elementId='work-info' />
        </div>

        <Image
          width={width}
          contentUrl={imageContentUrl}
          lazyload={true}
          sizesQueries='(min-width: 860px) 800px, calc(92.59vw + 22px)'
          alt='' />

        <ImageViewer
          imageUrl={imageContentUrl}
          id={id}
          trackTitle={trackTitle} />
      </div>
    </div>
  );
};

export default WorkMedia;
