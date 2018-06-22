// @flow
import {Fragment} from 'react';
import {grid} from '../../../utils/classnames';
import PrimaryLink from '../Links/PrimaryLink/PrimaryLink';
import type {Book} from '../../../model/books';

const BookMetadata = ({book}: {| book: Book |}) => (
  <Fragment>
    <dl className='grid'>
      <dt className={'no-margin ' + grid({ s: 2, m: 2, l: 2, xl: 2 })}>Format</dt>
      <dd className={'no-margin ' + grid({ s: 10, m: 10, l: 10, xl: 10 })}>{book.format}</dd>

      <dt className={'no-margin ' + grid({ s: 2, m: 2, l: 2, xl: 2 })}>Extent</dt>
      <dd className={'no-margin ' + grid({ s: 10, m: 10, l: 10, xl: 10 })}>{book.extent}</dd>

      <dt className={'no-margin ' + grid({ s: 2, m: 2, l: 2, xl: 2 })}>ISBN</dt>
      <dd className={'no-margin ' + grid({ s: 10, m: 10, l: 10, xl: 10 })}>{book.isbn}</dd>
    </dl>
    {book.orderLink && <PrimaryLink url={book.orderLink} name='Order online' />}
  </Fragment>
);

export default BookMetadata;
