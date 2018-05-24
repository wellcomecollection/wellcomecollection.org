// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import HTMLDate from '../HTMLDate/HTMLDate';
import type {Book} from '../../../model/books';

type Props = {|
  book: Book
|}

// TODO: Add subtitle
const BookPage = ({ book }: Props) => {
  const DateInfo = book.datePublished && <HTMLDate date={book.datePublished} />;
  const imageSlice = book.promo && book.promo.image && {
    weight: 'default',
    type: 'image',
    value: book.promo.image
  };
  const bodyWithImage = imageSlice ? [imageSlice].concat(book.body) : book.body;

  return (
    <BasePage
      id={book.id}
      Background={null}
      TagBar={null}
      DateInfo={DateInfo}
      InfoBar={null}
      Description={
        <Fragment>
          {book.authorName && <p className='no-margin'>by {book.authorName}</p>}
        </Fragment>
      }
      FeaturedMedia={null}
      title={book.title || 'TITLE MISSING'}
      body={bodyWithImage}>
    </BasePage>
  );
};

export default BookPage;
