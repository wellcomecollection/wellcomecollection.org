import { font, classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import PrismicImage from '../PrismicImage/PrismicImage';
import { getCrop } from '@weco/common/model/image';
import { BookBasic } from '../../types/books';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
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

type LinkOrSpanSpaceAttrs = {
  url?: string;
  elem?: string;
};

const LinkOrSpanSpace = styled(Space).attrs<LinkOrSpanSpaceAttrs>(props => ({
  as: props.url ? 'a' : props.elem || 'div',
  href: props.url || undefined,
}))<LinkOrSpanSpaceAttrs>``;

type Props = {
  book: BookBasic;
};

const BookPromo: FunctionComponent<Props> = ({ book }: Props): ReactElement => {
  const { id, title, subtitle, promo, cover } = book;
  return (
    <LinkOrSpanSpace
      v={{
        size: 'xl',
        properties: ['padding-top'],
      }}
      h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
      url={`/books/${id}`}
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
          {cover?.contentUrl && (
            <BookPromoImage v={{ size: 'l', properties: ['bottom'] }}>
              <PrismicImage
                image={{
                  contentUrl: cover.contentUrl || '',
                  width: cover.width || 0,
                  height: cover.height || 0,
                  alt: '',
                }}
                sizes={{
                  xlarge: 1 / 6,
                  large: 1 / 6,
                  medium: 1 / 2,
                  small: 1,
                }}
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

          {promo?.caption && (
            <Space v={{ size: 's', properties: ['margin-top'] }}>
              <p
                className={classNames({
                  [font('hnr', 5)]: true,
                  'no-margin': true,
                })}
              >
                {promo?.caption}
              </p>
            </Space>
          )}
        </Space>
      </Space>
    </LinkOrSpanSpace>
  );
};

export default BookPromo;
