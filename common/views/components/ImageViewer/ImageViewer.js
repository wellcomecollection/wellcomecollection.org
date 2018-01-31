// @flow

import {font, spacing} from '../../../utils/classnames';
import {convertImageUri, convertIiifUriToInfoUri} from '../../../utils/convert-image-uri';
import ButtonButton from '../Buttons/ButtonButton/ButtonButton';

const buttonFontClasses = font({s: 'HNM5'});
const commonBtnTracking = (id, trackTitle) => {
  return `"category": "component", "label": "id:${id}', title:${trackTitle}"`;
};

type Props = {
  id: string,
  trackTitle: string,
  imageUrl: string
}

const ImageViewer = ({id, trackTitle, imageUrl}: Props) => (
  <div className="js-image-viewer image-viewer">
    <ButtonButton
      text='View larger image'
      icon='zoomIn'
      extraClasses={`${buttonFontClasses} btn--round image-viewer__launch-button js-image-viewer__launch-button`}
      eventTracking={`{${commonBtnTracking(id, trackTitle)}, "action": "work-launch-image-viewer:btnClick"}`}
    />

    <div
      className="image-viewer__content"
      id={id}
      data-info-src={convertIiifUriToInfoUri(convertImageUri(imageUrl, 'full', false))}>

      <div className="image-viewer__controls flex flex-end flex--v-center">
        <ButtonButton
          text='Zoom in'
          id={`zoom-in-${id}`}
          icon='zoomIn'
          extraClasses={`${buttonFontClasses} btn--round btn--charcoal ${spacing({s: 1}, {margin: ['right']})}`}
          eventTracking={`{${commonBtnTracking(id, trackTitle)}, "action": "work-zoom-in-button:click"}`}
        />

        <ButtonButton
          text='Zoom out'
          id={`zoom-out-${id}`}
          icon='zoomOut'
          extraClasses={`${buttonFontClasses} btn--round btn--charcoal ${spacing({s: 8}, {margin: ['right']})}`}
          eventTracking={`{${commonBtnTracking(id, trackTitle)}, "action": "work-zoom-out-button:click"}`}
        />

        <ButtonButton
          text='Close image viewer'
          icon='cross'
          extraClasses={`${buttonFontClasses} btn--round btn--charcoal js-image-viewer__exit-button ${spacing({s: 2}, {margin: ['right']})}`}
          eventTracking={`{${commonBtnTracking(id, trackTitle)}, "action": "work-exit-image-viewer:btnClick"}`}
        />
      </div>

      <div className='image-viewer__image' id={`image-viewer-${id}`}></div>
    </div>
  </div>
);

export default ImageViewer;
