// @flow
import {spacing, font} from '../../../utils/classnames';
import {trackEvent, trackEventV2} from '../../../utils/ga';
import UiImage from '../Image/Image';
import Icon from '../Icon/Icon';
import type {ImageType} from '../../../model/image';

type Props = {|
  url: string,
  title: string,
  subtitle: ?string,
  description: ?string,
  image: ?ImageType
|}

const BookPromo = ({
  url,
  image,
  title,
  subtitle,
  description
}: Props) => {
  const PromoTag = url ? 'a' : 'span';

  return (
    <PromoTag
      data-component='BookPromo'
      href={url}
      className={`book-promo ${spacing({s: 10}, {margin: ['top']})} ${spacing({s: 4, m: 5}, {margin: ['bottom']})} ${spacing({s: 4}, {padding: ['top', 'right', 'bottom', 'left']})} rounded-diagonal`}
      onClick={() => {
        trackEventV2({
          eventCategory: 'BookPromo',
          eventAction: 'follow link',
          eventLabel: title
        });
        trackEvent({
          category: 'component',
          action: 'BookPromo:click',
          label: `title:${title}`
        });
      }}>
      <div className={`book-promo__image-container ${spacing({s: 4}, {margin: ['right', 'bottom']})}`}>

        {image && image.contentUrl && <UiImage
          contentUrl={image.contentUrl}
          width={image.width || 0}
          height={image.height || 0}
          alt={image.alt || ''}
          sizesQueries='(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)'
        />
        }
      </div>
      <div className='book-promo__text-container'>
        {title && <h3 className={`book-promo__title ${font({s: 'HNM3'})} ${spacing({s: 0}, {margin: ['top', 'bottom']})}`}>{title}</h3>}

        {subtitle && <h4 className={`${font({s: 'HNM4'})} ${spacing({s: 0}, {margin: ['top', 'bottom']})}`}>{subtitle}</h4>}

        {description && <p className={`${font({s: 'HNL4'})} ${spacing({s: 2}, {margin: ['top']})} ${spacing({s: 0}, {margin: ['bottom']})}`}>{description}</p>}

        <span className={`flex-inline ${font({s: 'HNM4'})} ${spacing({s: 2}, {margin: ['top']})}`}>
          <Icon name='arrow' extraClasses='icon--green' />
          <span className={spacing({s: 1}, {margin: ['left']})}>More information</span>
        </span>
      </div>
    </PromoTag>
  );
};

export default BookPromo;
