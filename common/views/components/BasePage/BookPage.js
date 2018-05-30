// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import HTMLDate from '../HTMLDate/HTMLDate';
import Contributors from '../Contributors/Contributors';
import {UiImage} from '../Images/Images';
import WobblyBackground from '../BaseHeader/WobblyBackground';
import type {Book} from '../../../model/books';

type Props = {|
  book: Book
|}

// TODO: Add subtitle
const BookPage = ({ book }: Props) => {
  // TODO: (drupal migration) this should be linked in Prismic
  const person = book.authorName && {
    type: 'people',
    id: 'xxx',
    name: book.authorName || '',
    image: {
      contentUrl: book.authorImage || '',
      width: 800,
      height: null
    },
    twitterHandle: null,
    // parse this as string
    description: book.authorDescription
  };
  const contributor = person && {
    contributor: person,
    description: null,
    role: {
      id: 'WcUWeCgAAFws-nGh',
      title: 'Author'
    }
  };
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
  const Header = (<BaseHeader
    title={book.title || 'TITLE MISSING'}
    Background={WobblyBackground()}
    TagBar={null}
    DateInfo={DateInfo}
    Description={
      <Fragment>
        {book.authorName && <p className='no-margin'>{book.authorName}</p>}
      </Fragment>
    }
    InfoBar={null}
    FeaturedMedia={FeaturedMedia}
  />);

  return (
    <BasePage
      id={book.id}
      Header={Header}
      body={book.body}>
      <Fragment>
        {contributor &&
          <Contributors contributors={[contributor]} />
        }
      </Fragment>
    </BasePage>
  );
};

export default BookPage;
