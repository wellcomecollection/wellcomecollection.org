// @flow
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import UiImage from '../Image/Image';
import Icon from '../Icon/Icon';
import type { ImageType } from '../../../model/image';
import Space from '../styled/Space';

type Props = {|
  url: string,
  title: string,
  subtitle: ?string,
  description: ?string,
  image: ?ImageType,
|};

const BookPromo = ({ url, image, title, subtitle, description }: Props) => {
  return (
    <Space
      v={{
        size: 'l',
        properties: ['margin-bottom', 'padding-top', 'padding-bottom'],
      }}
      h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
      as={url ? 'a' : 'span'}
      data-component="BookPromo"
      href={url}
      className={classNames({
        'book-promo rounded-diagonal': true,
      })}
      onClick={() => {
        trackEvent({
          category: 'BookPromo',
          action: 'follow link',
          label: title,
        });
      }}
    >
      <Space
        v={{
          size: 'm',
          properties: ['margin-bottom'],
        }}
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
      </Space>
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
          <Space v={{ size: 'm', properties: ['margin-top'] }}>
            <p
              className={classNames({
                [font('hnl', 5)]: true,
                'no-margin': true,
              })}
            >
              {description}
            </p>
          </Space>
        )}

        <Space
          v={{
            size: 'm',
            properties: ['margin-top'],
          }}
          className={classNames({
            'flex-inline': true,
            [font('hnm', 5)]: true,
          })}
        >
          <Icon name="arrow" extraClasses="icon--green" />
          <Space as="span" h={{ size: 's', properties: ['margin-left'] }}>
            More information
          </Space>
        </Space>
      </div>
    </Space>
  );
};

export default BookPromo;
