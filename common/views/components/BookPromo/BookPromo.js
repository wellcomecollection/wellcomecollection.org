// @flow
import { spacing, font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import UiImage from '../Image/Image';
import Icon from '../Icon/Icon';
import type { ImageType } from '../../../model/image';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  url: string,
  title: string,
  subtitle: ?string,
  description: ?string,
  image: ?ImageType,
|};

const BookPromo = ({ url, image, title, subtitle, description }: Props) => {
  return (
    <VerticalSpace
      size="l"
      as={url ? 'a' : 'span'}
      properties={['margin-bottom', 'padding-top', 'padding-bottom']}
      data-component="BookPromo"
      href={url}
      className={classNames({
        'book-promo rounded-diagonal': true,
        [spacing({ s: 4 }, { padding: ['right', 'left'] })]: true,
      })}
      onClick={() => {
        trackEvent({
          category: 'BookPromo',
          action: 'follow link',
          label: title,
        });
      }}
    >
      <VerticalSpace
        size="m"
        className={classNames({
          'book-promo__image-container': true,
          [spacing({ s: 4 }, { margin: ['right'] })]: true,
        })}
      >
        {image && image.contentUrl && (
          <UiImage
            contentUrl={image.contentUrl}
            width={image.width || 0}
            height={image.height || 0}
            alt={image.alt || ''}
            sizesQueries="(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)"
            tasl={null}
          />
        )}
      </VerticalSpace>
      <div className="book-promo__text-container">
        {title && (
          <h3
            className={classNames({
              'no-margin book-promo__title': true,
              [font({ s: 'HNM3' })]: true,
            })}
          >
            {title}
          </h3>
        )}

        {subtitle && (
          <h4
            className={classNames({
              'no-margin': true,
              [font({ s: 'HNM4' })]: true,
            })}
          >
            {subtitle}
          </h4>
        )}

        {description && (
          <VerticalSpace size="m" properties={['margin-top']}>
            <p
              className={classNames({
                [font({ s: 'HNL4' })]: true,
                'no-margin': true,
              })}
            >
              {description}
            </p>
          </VerticalSpace>
        )}

        <VerticalSpace
          size="m"
          properties={['margin-top']}
          className={classNames({
            'flex-inline': true,
            [font({ s: 'HNM4' })]: true,
          })}
        >
          <Icon name="arrow" extraClasses="icon--green" />
          <span className={spacing({ s: 1 }, { margin: ['left'] })}>
            More information
          </span>
        </VerticalSpace>
      </div>
    </VerticalSpace>
  );
};

export default BookPromo;
