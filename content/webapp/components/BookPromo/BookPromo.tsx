import { font, classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { BookBasic } from '../../types/books';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import { FC } from 'react';
import BookImage from '../../components/BookImage/BookImage';

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

const BookPromo: FC<Props> = ({ book }) => {
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
        <BookImage
          image={{
            contentUrl: cover?.contentUrl || '',
            width: cover?.width || 0,
            height: cover?.height || 0,
            // We intentionally omit the alt text on promos, so screen reader
            // users don't have to listen to the alt text before hearing the
            // title of the item in the list.
            //
            // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
            alt: '',
          }}
          sizes={{
            xlarge: 1 / 6,
            large: 1 / 6,
            medium: 1 / 3,
            small: 1,
          }}
          quality="low"
        />
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
                [font('intb', 5)]: true,
              })}
            >
              {subtitle}
            </Space>
          )}

          {promo?.caption && (
            <Space v={{ size: 's', properties: ['margin-top'] }}>
              <p
                className={classNames({
                  [font('intr', 5)]: true,
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
