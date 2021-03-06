import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import UiImage from '../Image/Image';
import { ImageType } from '../../../model/image';
import Space from '../styled/Space';
import styled from 'styled-components';
import LabelsList from '../LabelsList/LabelsList';
import { FunctionComponent, ReactElement } from 'react';

const BookPromoImageContainer = styled.div.attrs({
  className: classNames({
    'bg-cream relative': true,
  }),
})`
  height: 0;
  padding-top: 100%;
  transform: rotate(-2deg);
`;

const BookPromoImage = styled(Space).attrs({
  className: classNames({
    absolute: true,
  }),
})`
  width: 66%;
  left: 50%;
  transform: translateX(-50%) rotate(2deg);
`;

type Props = {
  url: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image: ImageType | null;
};

type LinkOrSpanSpaceAttrs = {
  url?: string;
  elem?: string;
};

const LinkOrSpanSpace = styled(Space).attrs<LinkOrSpanSpaceAttrs>(props => ({
  as: props.url ? 'a' : props.elem || 'div',
  href: props.url || undefined,
}))<LinkOrSpanSpaceAttrs>``;

const BookPromo: FunctionComponent<Props> = ({
  url,
  image,
  title,
  subtitle,
  description,
}: Props): ReactElement => {
  return (
    <LinkOrSpanSpace
      v={{
        size: 'xl',
        properties: ['padding-top'],
      }}
      h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
      url={url}
      className={classNames({
        'block promo-link plain-link': true,
      })}
      onClick={() => {
        trackEvent({
          category: 'BookPromo',
          action: 'follow link',
          label: title,
        });
      }}
    >
      <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
        <BookPromoImageContainer>
          {image && image.contentUrl && (
            <BookPromoImage v={{ size: 'l', properties: ['bottom'] }}>
              <UiImage
                contentUrl={image.contentUrl}
                width={image.width || 0}
                height={image.height || 0}
                alt=""
                sizesQueries="(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)"
                tasl={null}
              />
            </BookPromoImage>
          )}
        </BookPromoImageContainer>
        <Space
          h={{
            size: 'l',
            properties: ['padding-left', 'padding-right'],
          }}
        >
          <Space
            v={{ size: 's', properties: ['margin-bottom'] }}
            className={'relative'}
          >
            <Space
              v={{
                size: 'm',
                negative: true,
                properties: ['margin-top'],
              }}
            >
              <LabelsList labels={[{ text: 'Book' }]} />
            </Space>
          </Space>
          {title && (
            <h3
              className={classNames({
                'no-margin promo-link__title': true,
                [font('wb', 4)]: true,
              })}
            >
              {title}
            </h3>
          )}

          {subtitle && (
            <Space
              as="h4"
              v={{ size: 's', properties: ['margin-top'] }}
              className={classNames({
                'no-margin': true,
                [font('hnb', 5)]: true,
              })}
            >
              {subtitle}
            </Space>
          )}

          {description && (
            <Space v={{ size: 's', properties: ['margin-top'] }}>
              <p
                className={classNames({
                  [font('hnr', 5)]: true,
                  'no-margin': true,
                })}
              >
                {description}
              </p>
            </Space>
          )}
        </Space>
      </Space>
    </LinkOrSpanSpace>
  );
};

export default BookPromo;
