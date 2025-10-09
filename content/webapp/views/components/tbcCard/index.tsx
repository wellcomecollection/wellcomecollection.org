import { FunctionComponent } from 'react';
import styled from 'styled-components';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import { BookBasic } from '@weco/content/types/books';
import BookImage from '@weco/content/views/components/BookImage';

type LinkSpaceAttrs = {
  $url: string;
};

const LinkSpace = styled(Space).attrs<LinkSpaceAttrs>(props => ({
  as: 'a',
  href: props.$url,
  $v: { size: 'xl', properties: ['padding-top'] },
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
}))<LinkSpaceAttrs>`
  display: block;

  &,
  &:link,
  &:visited {
    text-decoration: none;
    border: none;
  }

  &:hover h3,
  &:focus h3 {
    text-decoration: underline;
    text-decoration-color: ${props => props.theme.color('black')};
  }
`;

const Title = styled.h3.attrs({
  className: font('wb', 4),
})`
  margin: 0;
`;

const Subtitle = styled(Space).attrs({
  className: font('intb', 5),
  $v: { size: 's', properties: ['margin-top'] },
})`
  margin: 0;
`;

const Caption = styled.p.attrs({
  className: font('intr', 5),
})`
  margin: 0;
`;

const Meta = styled.p.attrs({
  className: font('intr', 6),
})`
  color: ${props => props.theme.color('neutral.600')};
  margin: 0;
`;

type Props = {
  book: BookBasic;
};

const BookCard: FunctionComponent<Props> = ({ book }) => {
  const { title, subtitle, promo, cover, meta } = book;
  return (
    <LinkSpace $url={linkResolver(book)}>
      <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
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
          $h={{ size: 'l', properties: ['padding-left', 'padding-right'] }}
        >
          <Space
            $v={{ size: 's', properties: ['margin-bottom'] }}
            style={{ position: 'relative' }}
          >
            <Space
              $v={{
                size: 'm',
                properties: ['margin-top'],
                negative: true,
              }}
            >
              <LabelsList labels={[{ text: 'Book' }]} />
            </Space>
          </Space>
          <Title>{title}</Title>

          {subtitle && <Subtitle as="h4">{subtitle}</Subtitle>}

          {promo?.caption && (
            <Space $v={{ size: 's', properties: ['margin-top'] }}>
              <Caption>{promo.caption}</Caption>
            </Space>
          )}
          {meta && <Meta>extra stuff here</Meta>}
        </Space>
      </Space>
    </LinkSpace>
  );
};

export default BookCard;
