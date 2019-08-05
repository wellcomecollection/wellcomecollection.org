// @flow
import { font, classNames } from '../../../utils/classnames';
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
        'padding-left-12 padding-right-12': true,
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
              [font('hnm', 4)]: true,
            })}
          >
            {title}
          </h3>
        )}

        {subtitle && (
          <h4
            className={classNames({
              'no-margin': true,
              [font('hnm', 4)]: true,
            })}
          >
            {subtitle}
          </h4>
        )}

        {description && (
          <VerticalSpace size="m" properties={['margin-top']}>
            <p
              className={classNames({
                [font('hnl', 5)]: true,
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
            [font('hnm', 5)]: true,
          })}
        >
          <Icon name="arrow" extraClasses="icon--green" />
          <span className={'margin-left-6'}>More information</span>
        </VerticalSpace>
      </div>
    </VerticalSpace>
  );
};

export default BookPromo;
