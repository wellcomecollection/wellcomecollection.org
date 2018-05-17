// @flow
import {Fragment} from 'react';
import {spacing} from '../../../../utils/classnames';
import BasicPage from './BasicPage';
import DateRange from '../../DateRange/DateRange';
import StatusIndicator from '../../StatusIndicator/StatusIndicator';
import HTMLDate from '../../HTMLDate/HTMLDate';
import Contributor from '../../Contributor/Contributor';
import WobblyBackground from './WobblyBackground';
import {UiImage} from '../../Images/Images';
import type {UiBook} from '../../../../model/books';

type Props = {|
  book: UiBook
|}

const BookPage = ({ book }: Props) => {
  const DateInfo = book.end ? <DateRange start={book.start} end={book.end} /> : <HTMLDate date={book.start} />;
  const FeaturedMedia = book.promo && <UiImage {...book.promo.image} />;

  return (
    <BasicPage
      Background={WobblyBackground()}
      TagBar={
        <div
          style={{ minHeight: '48px' }}
          data-component='exhibit-exhibition-link'
          className='async-content exhibit-exhibition-link-placeholder'
          data-endpoint={`/books/${book.id}/exhibition`}
          data-prefix-endpoint='false'></div>
      }
      DateInfo={DateInfo}
      InfoBar={<StatusIndicator start={book.start} end={(book.end || new Date())} />}
      Description={null}
      FeaturedMedia={FeaturedMedia}
      title={book.title}
      body={book.body}>

      <Fragment>
        <div className={`${spacing({s: 2}, {padding: ['top']})} border-top-width-1 border-color-smoke`}>
          {book.contributors.length > 0 &&
          <h2 className='h2'>Contributors</h2>
          }
          {book.contributors.map(({contributor, role, description}) => (
            <Fragment key={contributor.id}>
              <Contributor contributor={contributor} role={role} description={description} />
            </Fragment>
          ))}
        </div>
      </Fragment>
    </BasicPage>
  );
};

export default BookPage;
