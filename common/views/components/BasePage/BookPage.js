// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import HTMLDate from '../HTMLDate/HTMLDate';
import {UiImage} from '../Images/Images';
import WobblyBackground from '../BaseHeader/WobblyBackground';
import type {Book} from '../../../model/books';

type Props = {|
  book: Book
|}

// TODO: Add subtitle
const BookPage = ({ book }: Props) => {
  const DateInfo = book.datePublished && <HTMLDate date={book.datePublished} />;
  const image = book.promo && book.promo.image;
  const tasl = image && {
    isFull: false,
    contentUrl: image.contentUrl,
    title: image.title,
    author: image.author,
    sourceName: image.source && image.source.name,
    sourceLink: image.source && image.source.link,
    license: image.license,
    copyrightHolder: image.copyright && image.copyright.holder,
    copyrightLink: image.copyright && image.copyright.link
  };
  /* https://github.com/facebook/flow/issues/2405 */
  /* $FlowFixMe */
  const FeaturedMedia = book.promo && <UiImage tasl={tasl} extraClasses='margin-v-auto inherit-max-height width-auto ' {...image} />;

  return (
    <BasePage
      id={book.id}
      Background={WobblyBackground()}
      TagBar={null}
      DateInfo={DateInfo}
      InfoBar={null}
      Description={
        <Fragment>
          {book.authorName && <p className='no-margin'>by {book.authorName}</p>}
        </Fragment>
      }
      FeaturedMedia={FeaturedMedia}
      title={book.title || 'TITLE MISSING'}
      body={book.body}>
    </BasePage>
  );
};

export default BookPage;
