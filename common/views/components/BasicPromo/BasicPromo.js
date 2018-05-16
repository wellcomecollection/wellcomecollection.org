// @flow
import Image from '../Image/Image';
import {spacing, font, grid} from '../../../utils/classnames';
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
}: Props) => {
  const textGridSize = imageProps ? 9 : 12;
  return (
    <a
      data-component={promoType}
      data-track-event={JSON.stringify({
        category: 'component',
        action: `${promoType}:click`
      })}
      href={url}
      className='grid plain-link'
    >
      {imageProps &&
        <div className={
          grid({ s: 3, m: 3, l: 3, xl: 3 }) +
          ` rounded-corners`
        }>
          {/* Find out why we can't just pass `imageProps` here */}
          <Image
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
            extraClasses={'rounded-corners'}
          />
        </div>
      }

      <div className={grid({ s: textGridSize, m: textGridSize, l: textGridSize, xl: textGridSize })}>
        <div className={`${font({s: 'WB5'})} ${spacing({s: 0}, {margin: ['top']})}`}>
          {title}
        </div>
        {description &&
        <span className={[
          spacing({s: 2}, {margin: ['top']}),
          font({s: 'HNL4'})
        ].join(' ')}>
          {description}
        </span>
        }
      </div>
    </a>
  );
};

export default BasicPromo;
