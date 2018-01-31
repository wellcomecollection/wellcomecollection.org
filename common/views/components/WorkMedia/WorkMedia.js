// @flow

import {grid, font, spacing} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import Image from '../Image/Image';
import ImageViewer from '../ImageViewer/ImageViewer';
import ScrollToInfo from '../ScrollToInfo/ScrollToInfo';

type Props = {|
  queryString?: string,
  id: string,
  trackTitle: string,
  iiifModel: {
    contentUrl: string,
    caption: string,
    width: string
  },
  iiifData: {
    infoUrl: string,
    lazyload: boolean,
    sizesQueries: string
  }
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

const WorkMedia = ({queryString, id, trackTitle, iiifModel, iiifData}: Props) => (
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
        width={iiifModel.width}
        contentUrl={iiifModel.contentUrl}
        lazyload={iiifData.lazyload}
        sizesQueries={iiifData.sizesQueries} />

      <ImageViewer
        imageUrl={iiifModel.contentUrl}
        id={id}
        trackTitle={trackTitle} />
    </div>
  </div>
);

export default WorkMedia;
