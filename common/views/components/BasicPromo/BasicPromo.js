// @flow
import Image from '../Image/Image';
import {spacing, font} from '../../../utils/classnames';
import type {Props as ImageProps} from '../Image/Image';

type Props = {|
  promoType: string,
  url: string,
  title: string,
  description: ?string,
  imageProps: ?ImageProps
|}

const BasicPromo = ({
  promoType,
  url,
  title,
  description,
  imageProps
}: Props) => (
  <a
    data-component={promoType}
    data-track-event={JSON.stringify({
      category: 'component',
      action: `${promoType}:click`
    })}
    href={url}
    className='plain-link promo-link bg-cream rounded-top rounded-bottom overflow-hidden flex flex--column'
  >
    {/* Find out why we can't just pass `imageProps` here */}
    {imageProps && <Image
      width={imageProps.width}
      height={imageProps.height}
      contentUrl={imageProps.contentUrl}
      clipPathClass={imageProps.clipPathClass}
      alt={imageProps.alt}
      caption={imageProps.alt}
      lazyload={imageProps.lazyload}
      sizesQueries={imageProps.sizesQueries}
      copyright={imageProps.copyright}
      defaultSize={imageProps.defaultSize}
      clickHandler={imageProps.clickHandler}
      zoomable={imageProps.zoomable}
    />}

    <div className={`${[
      spacing({s: 2}, {padding: ['top']}),
      spacing({s: 3}, {padding: ['left', 'right']}),
      spacing({s: 4}, {padding: ['bottom']})
    ].join(' ')} flex flex--column flex-1
    `}>
      <div className='promo__heading'>
        <div className={`promo-link__title ${font({s: 'WB6'})} ${spacing({s: 0}, {margin: ['top']})}`}>
          {title}
        </div>
      </div>

      {description &&
        <span className={font({s: 'HNL5'})}>
          {description}
        </span>
      }
    </div>
  </a>
);

export default BasicPromo;
