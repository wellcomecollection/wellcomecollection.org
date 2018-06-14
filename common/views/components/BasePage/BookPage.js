// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import HTMLDate from '../HTMLDate/HTMLDate';
import Contributors from '../Contributors/Contributors';
import PrimaryLink from '../Links/PrimaryLink/PrimaryLink';
import {UiImage} from '../Images/Images';
import WobblyBackground from '../BaseHeader/WobblyBackground';
import {grid, spacing} from '../../../utils/classnames';
import type {Book} from '../../../model/books';

type Props = {|
  book: Book,
  booksMetadataFlag: boolean
|}

const BookMetadata = ({book}: {| book: Book |}) => (
  <dl className='grid'>
    <dt className={'no-margin ' + grid({ s: 2, m: 2, l: 2, xl: 2 })}>Price</dt>
    <dd className={'no-margin ' + grid({ s: 10, m: 10, l: 10, xl: 10 })}>{book.price}</dd>

    <dt className={'no-margin ' + grid({ s: 2, m: 2, l: 2, xl: 2 })}>Format</dt>
    <dd className={'no-margin ' + grid({ s: 10, m: 10, l: 10, xl: 10 })}>{book.format}</dd>

    <dt className={'no-margin ' + grid({ s: 2, m: 2, l: 2, xl: 2 })}>Extent</dt>
    <dd className={'no-margin ' + grid({ s: 10, m: 10, l: 10, xl: 10 })}>{book.extent}</dd>

    <dt className={'no-margin ' + grid({ s: 2, m: 2, l: 2, xl: 2 })}>ISBN</dt>
    <dd className={'no-margin ' + grid({ s: 10, m: 10, l: 10, xl: 10 })}>{book.isbn}</dd>
  </dl>
);

// TODO: Add subtitle
const BookPage = ({ book, booksMetadataFlag }: Props) => {
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
    title={book.title || ''}
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
      Body={<Body
        body={book.body} />}>
      <Fragment>
        {contributors.length > 0 &&
          <Contributors contributors={contributors} />
        }
        { booksMetadataFlag &&
            <div className={`${spacing({s: 2}, {padding: ['top']})} ${spacing({s: 2}, {margin: ['top']})} border-top-width-1 border-color-smoke`}>
              <h2 className='h2'>More information</h2>
              <BookMetadata book={book} />
            </div>
        }

        {book.orderLink && <PrimaryLink url={book.orderLink} name='Order online' />}
      </Fragment>
    </BasePage>
  );
};

export default BookPage;
