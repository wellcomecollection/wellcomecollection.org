// @flow
import {Fragment} from 'react';
import BasicPage from './BasicPage';
import HTMLDate from '../../HTMLDate/HTMLDate';
import PrimaryLink from '../../Links/PrimaryLink/PrimaryLink';
import type {Book} from '../../../../model/books';

type Props = {|
  book: Book
|}

const BookPage = ({ book }: Props) => {
  const DateInfo = book.datePublished && <HTMLDate date={book.datePublished} />;

  return (
    <BasicPage
      id={book.id}
      Background={null}
      TagBar={null}
      DateInfo={DateInfo}
      InfoBar={null}
      Description={
        <Fragment>
          {book.subtitle && <p>{book.subtitle}</p>}
          {book.authorName && <p>by {book.authorName}</p>}
          {book.orderLink && <PrimaryLink name={`Order online${book.price ? ` for ${book.price}` : ''}`} link={book.orderLink} />}
        </Fragment>
      }
      FeaturedMedia={null}
      title={book.title || 'TITLE MISSING'}
      body={book.body || []}>
    </BasicPage>
  );
};

export default BookPage;
