import { font } from '@weco/common/utils/classnames';
import { trackGaEvent } from '@weco/common/utils/ga';
import { BookBasic } from '../../types/books';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import { FunctionComponent } from 'react';
import BookImage from '../../components/BookImage/BookImage';

type LinkOrSpanSpaceAttrs = {
  url?: string;
  elem?: string;
};

const LinkOrSpanSpace = styled(Space).attrs<LinkOrSpanSpaceAttrs>(props => ({
  as: props.url ? 'a' : props.elem || 'div',
  href: props.url || undefined,
  className: 'promo-link plain-link',
  v: {
    size: 'xl',
    properties: ['padding-top'],
  },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
}))<LinkOrSpanSpaceAttrs>`
  display: block;
`;

const Title = styled.h3.attrs({
  className: `promo-link__title ${font('wb', 4)}`,
})`
  margin: 0;
`;

const Subtitle = styled(Space).attrs({
  v: { size: 's', properties: ['margin-top'] },
  className: font('intb', 5),
})`
  margin: 0;
`;

const Caption = styled.p.attrs({
  className: font('intr', 5),
})`
  margin: 0;
`;

type Props = {
  book: BookBasic;
};

const BookPromo: FunctionComponent<Props> = ({ book }) => {
  const { id, title, subtitle, promo, cover } = book;
  return (
    <LinkOrSpanSpace
      url={`/books/${id}`}
      onClick={() => {
        trackGaEvent({
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
            className="relative"
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
          {title && <Title>{title}</Title>}

          {subtitle && <Subtitle as="h4">{subtitle}</Subtitle>}

          {promo?.caption && (
            <Space v={{ size: 's', properties: ['margin-top'] }}>
              <Caption>{promo.caption}</Caption>
            </Space>
          )}
        </Space>
      </Space>
    </LinkOrSpanSpace>
  );
};

export default BookPromo;
