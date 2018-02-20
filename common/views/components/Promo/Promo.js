// @flow

import {spacing, font, grid} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import getIconForContentType from '../../../utils/get-icon-for-content-type';
import getSeriesTitle from '../../../utils/get-series-title';
import Image from '../Image/Image';
import type {Props as ImageProps} from '../Image/Image';
import type {ContentType} from '../../../model/content-type';
import type {Weight} from '../../../model/weight';
import {Fragment} from 'react';

function contentTypeText(commissionedSeries, positionInSeries, seriesTitle, contentType) {
  if (commissionedSeries && positionInSeries) {
    return `${commissionedSeries.name}: Part ${positionInSeries}`;
  } else if (seriesTitle) {
    return seriesTitle;
  } else if (contentType !== 'work') {
    return contentType;
  }
}

function titleFontClasses(contentType) {
  if (contentType === 'work') {
    return `${font({s: 'HNL5'})} text--truncate`;
  } else {
    return font({s: 'WB7', l: 'WB6'});
  }
}

function headingText(title, contentType) {
  if (title) {
    return title;
  } else if (contentType === 'work') {
    return 'Title not found';
  } else {
    return 'Coming soon…';
  }
}

type PromoDescriptionProps = {|
  standalone: boolean,
  children: React.Node
|}

const PromoDescription = ({standalone, children}: PromoDescriptionProps) => {
  if (standalone) {
    return (
      <div className={`row bg-cream ${spacing({s: 10}, {padding: ['top']})}`}>
        <div className="container">
          <div className="grid">
            <div className={`${grid({l: 10, shiftL: 1, m: 10, shiftM: 1, s: 12})}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <Fragment>{children}</Fragment>
    );
  }
};

type Props = {|
  url?: string,
  id?: string,
  extraClasses?: string,
  contentType: ContentType,
  isConstrained?: boolean,
  image?: ImageProps,
  series?: [], // TODO: use series type
  defaultSize?: number,
  positionInSeries?: number,
  standalone?: boolean,
  weight?: Weight,
  description?: string,
  sizes?: string,
  headingLevel?: string,
  datePublished?: string,
  title?: string
|}

const Promo = ({url, id, extraClasses = '', contentType, isConstrained, image, series, defaultSize, positionInSeries, standalone, weight, description, sizes, headingLevel, datePublished, title}: Props) => {
  const PromoTag = url ? 'a' : 'span';
  const HeadingTag = headingLevel || 'h2';
  const seriesTitle =  series && getSeriesTitle(series);
  const commissionedSeries = series && series.find(item => item.commissionedLength);

  return (
    <PromoTag id={id}
      data-component="ArticlePromo"
      data-track-event={`{category: 'component', action: 'ArticlePromo:click' }`}
      href={url}
      className={`promo ${extraClasses} promo--${contentType} ${!url ? 'promo--surrogate' : ''} ${standalone ? 'promo--standalone' : ''}`}>
      <div className={`promo__image-container ${isConstrained ? 'promo__image-container--constrained' : ''}`}>
        {image
          ? <Image
            width={image.width}
            contentUrl={image.contentUrl}
            lazyload={true}
            sizesQueries={sizes}
            clipPathClass={series && commissionedSeries && positionInSeries && url ? 'promo__clip-path--chapters-third' : ''}
            defaultSize={defaultSize}
            alt='' />
          : <div className="promo__image-surrogate">
            <div className="promo__image-surrogate-inner"></div>
          </div>
        }

        {commissionedSeries && positionInSeries && url
          // {% componentV2 'chapter-indicator', {series: commissionedSeries, position: positionInSeries} %}
        }

        {contentType === 'gallery' || contentType === 'audio' || contentType === 'video' &&
          <div className={`promo__icon-container ${font({s: 'HNL6'})}`}>
            <Icon name={getIconForContentType(contentType)} />
          </div>
        }
      </div>
      <PromoDescription standalone={standalone || false}>
        <div className={`promo__description ${font({s: 'HNL5'})}`}>
          <div className="promo__heading">
            {contentType &&
              <span className={`promo__type font-charcoal ${spacing({s: 1}, {margin: ['bottom']})} ${font({s: 'HNL6', l: 'HNL5'})}`}
                aria-hidden="true">
                {contentTypeText(commissionedSeries, positionInSeries, seriesTitle, contentType)}
              </span>
            }

            <HeadingTag className={`promo__title ${titleFontClasses(contentType)} ${weight === 'lead' ? 'promo__title--lead' : ''}`}>
              {headingText(title, contentType)}
            </HeadingTag>
          </div>

          {datePublished && contentType === 'work' &&
            <p className={`promo ${font({s: 'HNL5'})} font-pewter relative`}>{datePublished}</p>
          }

          {description &&
            <span className="promo__copy">{description}</span>
          }
        </div>
      </PromoDescription>
    </PromoTag>
  );
};

export default Promo;
