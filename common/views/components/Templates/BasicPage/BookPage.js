// @flow
import BasicPage from './BasicPage';
import HTMLDate from '../../HTMLDate/HTMLDate';
import WobblyBackground from './WobblyBackground';
import {UiImage} from '../../Images/Images';
import type {Book} from '../../../../model/books';

type Props = {|
  book: Book
|}

const BookPage = ({ book }: Props) => {
  const DateInfo = book.datePublished && <HTMLDate date={book.datePublished} />;
  const FeaturedMedia = book.promo && <UiImage {...book.promo.image} />;

  return (
    <BasicPage
      id={book.id}
      Background={WobblyBackground()}
      TagBar={null}
      DateInfo={DateInfo}
      InfoBar={null}
      Description={null}
      FeaturedMedia={FeaturedMedia}
      title={book.title || 'TITLE MISSING'}
      body={book.body || []}>
    </BasicPage>
  );
};

export default BookPage;
