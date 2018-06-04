// @flow

import {spacing, font} from '../../../utils/classnames';
import {striptags} from '../../../utils/striptags';
import {truncate} from '../../../utils/truncate';
import Icon from '../Icon/Icon';
import getIconForContentType from '../../../utils/get-icon-for-content-type';
import getSeriesTitle from '../../../utils/get-series-title';
import Image from '../Image/Image';
import type {Props as ImageProps} from '../Image/Image';
import type {ContentType} from '../../../model/content-type';
import type {Weight} from '../../../model/weight';
import type {EditorialSeries} from '../../../model/editorial-series';
import {Fragment} from 'react';
import ChapterIndicator from '../ChapterIndicator/ChapterIndicator';

function partOf(commissionedSeries, seriesTitle) {
  return (
    <span className={font({s: 'HNM5'})}>
      <span className={font({s: 'HNL5'})}>Part of</span>{' '}
      {commissionedSeries ? commissionedSeries.name : seriesTitle}
    </span>
  );
}

function contentTypeLabel(contentType, commissionedSeries) {
  // FIXME: this hack can die when we separate out a WorkPromo
  return contentType !== 'work' && (
    <span className={`line-height-1 bg-yellow absolute promo__content-type ${font({s: 'HNM5'})} ${spacing({s: 1}, {padding: ['top', 'bottom', 'left', 'right']})}`}
      aria-hidden='true'>{commissionedSeries ? 'Digital Story' : contentType.charAt(0).toUpperCase() + contentType.slice(1)}</span>
  );
}

function titleFontClasses(contentType) {
  if (contentType === 'work') {
    return `${font({s: 'HNL5'})} text--truncate`;
  } else {
    return font({s: 'WB5'});
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
  children: React.Node
|}

const PromoDescription = ({children}: PromoDescriptionProps) => {
  return (
    <Fragment>{children}</Fragment>
  );
};

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
  const seriesTitle =  series && getSeriesTitle(series);
  const commissionedSeries = series && series.find(item => item.commissionedLength);
  const iconName = getIconForContentType(contentType);

  return (
    <PromoTag id={id}
      data-component='ArticlePromo'
      data-track-event={`${JSON.stringify({category: 'component', action: 'ArticlePromo:click'})}`}
      href={url}
      className={`promo promo--${contentType} ${!url ? 'promo--surrogate' : ''} ${weight === 'lead' ? 'promo--lead' : ''}`}>
      <div className={`promo__image-container ${spacing({s: 2}, {margin: ['bottom']})} ${contentType === 'work' ? 'promo__image-container--constrained' : ''}`}>
        {image
          ? <Image
            width={image.width}
            contentUrl={image.contentUrl}
            lazyload={true}
            sizesQueries={sizes}
            clipPathClass={series && commissionedSeries && positionInSeries && url ? 'promo__clip-path--chapters-third' : ''}
            alt='' />
          : <div className='promo__image-surrogate'>
            <div className='promo__image-surrogate-inner'></div>
          </div>
        }

        {commissionedSeries && positionInSeries && url &&
          <ChapterIndicator
            position={positionInSeries}
            color={commissionedSeries.color}
            commissionedLength={commissionedSeries.commissionedLength} />
        }

        {contentType &&
          <Fragment>
            {contentTypeLabel(contentType, commissionedSeries)}
          </Fragment>
        }

        {iconName &&
          <div className={`promo__icon-container ${font({s: 'HNL6'})}`}>
            <Icon name={iconName} />
          </div>
        }
      </div>

      <PromoDescription>
        <div className={`promo__description`}>
          <div className='promo__heading'>
            <HeadingTag className={`promo__title ${spacing({s: 0}, {margin: ['top']})} ${titleFontClasses(contentType)}`}>
              {headingText(title, contentType)}
            </HeadingTag>
          </div>

          {datePublished && contentType === 'work' &&
            <p className={`promo ${font({s: 'HNL5'})} font-pewter relative`}>{datePublished}</p>
          }

          {description && contentType !== 'work' &&
            <span className={`inline-block ${font({s: 'HNL4'})} ${spacing({s: 1}, {margin: ['bottom']})}`}>{truncate(striptags(description), 140)}</span>
          }

          {(commissionedSeries || seriesTitle) &&
            <span className={`block font-charcoal ${spacing({s: 1}, {margin: ['bottom']})} ${font({s: 'HNL6', l: 'HNL5'})}`}
              aria-hidden='true'>
              {partOf(commissionedSeries, seriesTitle)}
            </span>
          }
        </div>
      </PromoDescription>
    </PromoTag>
  );
};

export default Promo;
