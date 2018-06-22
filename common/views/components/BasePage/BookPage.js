// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import Contributors from '../Contributors/Contributors';
import PrimaryLink from '../Links/PrimaryLink/PrimaryLink';
import BookMetadata from '../BookMetadata/BookMetadata';
import {UiImage} from '../Images/Images';
import Tags from '../Tags/Tags';
import WobblyBackground from '../BaseHeader/WobblyBackground';
import {grid, spacing} from '../../../utils/classnames';
import type {Book} from '../../../model/books';

type Props = {|
  book: Book
|}

// TODO: Add subtitle
const BookPage = ({ book }: Props) => {
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
  const TagBar = <Tags tags={[{
    text: 'Book',
    url: '/books'
  }]} />;
  const Header = (<BaseHeader
    title={book.title || ''}
    Background={WobblyBackground()}
    TagBar={TagBar}
    DateInfo={null}
    Description={
      <Fragment>
        {book.authorName && <p className='no-margin'>{book.authorName}</p>}
      </Fragment>
    }
    InfoBar={null}
    FeaturedMedia={FeaturedMedia}
  />);

  // TODO: (drupal migration) we can drop reading the text fields once we've
  // migrated the content over
  const drupalPerson = book.authorName && {
    type: 'people',
    id: 'xxx',
    name: book.authorName || '',
    image: {
      contentUrl: book.authorImage || '',
      width: 800,
      height: 0,
      alt: `Image of ${book.authorName}`,
      tasl: {
        sourceName: 'Unknown',
        title: null,
        author: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null
      }
    },
    twitterHandle: null,
    // parse this as string
    description: book.authorDescription
  };
  const drupalContributor = drupalPerson && {
    contributor: drupalPerson,
    description: null,
    role: {
      id: 'WcUWeCgAAFws-nGh',
      title: 'Author'
    }
  };
  const contributors =
    book.contributors.length > 0 ? book.contributors
      : drupalContributor ? [drupalContributor] : [];

  return (
    <BasePage
      id={book.id}
      Header={Header}
      Body={<Body body={book.body} />}
    >
      {contributors.length > 0 ? <Contributors contributors={contributors} /> : null}
      <BookMetadata book={book} />
    </BasePage>
  );
};

export default BookPage;
