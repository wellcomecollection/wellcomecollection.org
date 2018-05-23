// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import HTMLDate from '../HTMLDate/HTMLDate';
import PrimaryLink from '../Links/PrimaryLink/PrimaryLink';
import Contributors from '../Contributors/Contributors';
import type {Book} from '../../../model/books';
import type {Contributor, PersonContributor} from '../../../model/contributors';

type Props = {|
  book: Book
|}

const BookPage = ({ book }: Props) => {
  // TODO: (drupal migration) this should be linked in Prismic
  const person: PersonContributor = {
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
  const contributor: Contributor = {
    contributor: person,
    description: null,
    role: {
      id: 'WcUWeCgAAFws-nGh',
      title: 'Author'
    }
  };
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
      <Fragment>
        {contributor &&
          <Contributors contributors={[contributor]} />
        }
      </Fragment>
    </BasePage>
  );
};

export default BookPage;
