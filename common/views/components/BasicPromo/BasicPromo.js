// @flow
import Image from '../Image/Image';
import {spacing, font, grid} from '../../../utils/classnames';
import type {Props as ImageProps} from '../Image/Image';

type Props = {|
  promoType: string,
  url: string,
  title: string,
  description: ?string,
  link: ?string,
  imageProps: ?ImageProps
|}

const BasicPromo = ({
  promoType,
  url,
  title,
  description,
  link,
  imageProps
}: Props) => {
  const textGridSizes = imageProps
    ? {s: 7, m: 7, l: 8, xl: 8}
    : {s: 12, m: 12, l: 12, xl: 12};

  return (
    <a
      data-component={promoType}
      data-track-event={JSON.stringify({
        category: 'component',
        action: `${promoType}:click`
      })}
      href={link || url}
      className='grid plain-link'
    >
      {imageProps &&
        <div className={grid({s: 5, m: 5, l: 4, xl: 4})}>
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
          />
        </div>
      }

      <div className={grid(textGridSizes)}>
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
