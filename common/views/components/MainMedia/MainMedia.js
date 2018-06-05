// @flow
import {grid, font} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import {UiImage} from '../Images/Images';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import License from '../License/License';
import type {LicenseType} from '../../../model/license';
import type {UiCaptionedImageProps} from '../Images/Images';

type Props = {|
  ...UiCaptionedImageProps,
  showWobblyEdge?: boolean,
  license?: LicenseType
|}

export const MainMedia = ({
  image,
  caption,
  sizesQueries,
  extraClasses = '',
  preCaptionNode,
  showWobblyEdge,
  license
}: Props) => {
  const uiImageProps = {...image, sizesQueries, isFull: true};

  return (
    <figure className={`captioned-image ${extraClasses}`}>
      <div className='captioned-image__image-container'>
        {/* https://github.com/facebook/flow/issues/2405 */}
        {/* $FlowFixMe */}
        <UiImage {...uiImageProps} />
      </div>

      {showWobblyEdge && <WobblyEdge background='cream' />}
      <div className='row bg-cream'>
        <div className='container'>
          <div className='grid'>
            <div className={grid({m: 10, xl: 10, shiftM: 1, shiftXl: 1})}>
              <figcaption className={`captioned-image__caption ${font({s: 'LR3', m: 'LR2'})}`}>
                {caption.length > 0 &&
                  <Icon name='image' extraClasses='float-l margin-right-s1' />
                }
                {license && <License subject={image.contentUrl} licenseType={license} />}
                {caption.length > 0 &&
                  <div
                    className={`captioned-image__caption-text`}
                    tabIndex={0}>
                    {preCaptionNode}
                    <PrismicHtmlBlock html={caption} />
                  </div>
                }
              </figcaption>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
};

export default MainMedia;
