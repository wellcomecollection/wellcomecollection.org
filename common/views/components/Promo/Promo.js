// @flow
// FIXME: this component is now only used on the /stories
// page. All others are {ContentType}Promos. Would be good to kill this.
import {spacing, font} from '../../../utils/classnames';
import {trackEvent} from '../../../utils/ga';
import {striptags} from '../../../utils/striptags';
import {truncate} from '../../../utils/truncate';
import Icon from '../Icon/Icon';
import getIconForContentType from '../../../utils/get-icon-for-content-type';
import Image from '../Image/Image';
import type {Props as ImageProps} from '../Image/Image';
import type {ContentType} from '../../../model/content-type';
import type {Weight} from '../../../model/weight';
import type {EditorialSeries} from '../../../model/editorial-series';
import {Fragment} from 'react';

function contentTypeLabel(contentType) {
  return (
    <span className={`line-height-1 bg-yellow absolute promo__content-type ${font({s: 'HNM5'})} ${spacing({s: 1}, {padding: ['top', 'bottom', 'left', 'right']})}`}
      aria-hidden='true'>{contentType.charAt(0).toUpperCase() + contentType.slice(1)}</span>
  );
}

function headingText(title, contentType) {
  if (title) {
    return title;
  } else {
    return 'Coming soon…';
  }
}

type Props = {|
  url?: string,
  id?: string,
  contentType: ContentType,
  image?: ImageProps,
  series?: EditorialSeries[],
  positionInSeries?: number,
  weight?: Weight,
  description?: string,
  sizes?: string,
  headingLevel?: string,
  datePublished?: string,
  title?: string
|}

const Promo = ({
  url,
  id,
  contentType,
  image,
  series,
  positionInSeries,
  weight,
  description,
  sizes,
  headingLevel,
  datePublished,
  title
}: Props) => {
  const PromoTag = url ? 'a' : 'span';
  const HeadingTag = headingLevel || 'h2';
  const iconName = getIconForContentType(contentType);
  const sixteenNineCrop = image && image.crops && image.crops['16:9'];

  return (
    <PromoTag id={id}
      data-component='ArticlePromo'
      href={url}
      className={`promo promo--${contentType} ${!url ? 'promo--surrogate' : ''} ${weight === 'featured' ? 'promo--lead' : ''}`}
      onClick={() => trackEvent({
        category: 'component',
        action: 'ArticlePromo:click',
        label: `id:${id || ''}`
      })}>
      <div className={`promo__image-container ${spacing({s: 2}, {margin: ['bottom']})}`}>
        {image
          ? <Image
            width={image.width}
            contentUrl={sixteenNineCrop ? sixteenNineCrop.contentUrl : image.contentUrl}
            lazyload={true}
            sizesQueries={sizes}
            alt='' />
          : <div className='promo__image-surrogate'><div className='promo__image-surrogate-inner'></div></div>
        }

        {contentType &&
          <Fragment>
            {contentTypeLabel(contentType)}
          </Fragment>
        }

        {iconName &&
          <div className={`promo__icon-container ${font({s: 'HNL6'})}`}>
            <Icon name={iconName} />
          </div>
        }
      </div>
      <div className={`promo__description`}>
        <div className='promo__heading'>
          <HeadingTag className={`promo__title ${spacing({s: 0}, {margin: ['top']})} ${font({s: 'WB5'})}`}>
            {headingText(title, contentType)}
          </HeadingTag>
        </div>

        {description &&
          <span className={`inline-block ${font({s: 'HNL4'})} ${spacing({s: 1}, {margin: ['bottom']})}`}>{truncate(striptags(description), 140)}</span>
        }
      </div>
    </PromoTag>
  );
};

export default Promo;
