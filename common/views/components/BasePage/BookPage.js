// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import HTMLDate from '../HTMLDate/HTMLDate';
import PrimaryLink from '../Links/PrimaryLink/PrimaryLink';
import type {Book} from '../../../model/books';

type Props = {|
  book: Book
|}

const BookPage = ({ book }: Props) => {
  const DateInfo = book.datePublished && <HTMLDate date={book.datePublished} />;

  return (
    <BasePage
      id={book.id}
      Background={null}
      TagBar={null}
      DateInfo={DateInfo}
      InfoBar={null}
      Description={
        <Fragment>
          {book.subtitle && <p>{book.subtitle}</p>}
          {book.authorName && <p>by {book.authorName}</p>}
          {book.orderLink && <PrimaryLink name='Order online' url={book.orderLink} />}
        </Fragment>
      }
      FeaturedMedia={null}
      title={book.title || 'TITLE MISSING'}
      body={book.body || []}>
    </BasePage>
  );
};

export default BookPage;
