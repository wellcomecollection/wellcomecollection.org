// @flow

import {grid, font, spacing} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import Image from '../Image/Image';
import ScrollToInfo from '../ScrollToInfo/ScrollToInfo';

type Props = {|
  queryString?: string,
  id: string,
  trackTitle: string,
  iiifModel: string, // TODO: check
  iiifData: string, // TODO: check
  image: any // TODO: make Image type?
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

const WorkMedia = ({queryString, id, trackTitle, iiifModel, iiifData, image}: Props) => (
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
    <div className="row bg-charcoal work-media js-work-media">
      <div className="pointer-events-none">
        <ScrollToInfo elementId='work-info' />
      </div>

      <Image width={image.width}
        height={image.height}
        contentUrl={image.contentUrl}
        useIiifOrigin={image.useIiifOrigin}
        clipPathClass={image.clipPathClass}
        alt={image.alt}
        caption={image.caption}
        lazyload={image.lazyload}
        sizesQueries={image.sizesQueries}
        copyright={image.copyright}
        defaultSize={image.defaultSize} />

      {/* % if featuresCohort | isFlagEnabled('zoomImages', featureFlags) %}
        {% componentV2 'image-viewer', {imageUrl: model.iiifModel.contentUrl}, null, {id: model.id, trackTitle: model.trackTitle} %}
      {% endif % */}
    </div>
  </div>
);

export default WorkMedia;
