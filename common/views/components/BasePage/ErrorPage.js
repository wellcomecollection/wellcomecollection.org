// @flow
import {classNames, spacing} from '../../../utils/classnames';
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import PrimaryLink from '../Links/PrimaryLink/PrimaryLink';

type Props = {|
  errorStatus: number
|}

const BookPage = ({ errorStatus }: Props) => {
  return (
    <BasePage
      id={'error'}
      Header={
        <BaseHeader
          title={'This isn’t the page you’re looking for, but how about these?'}
          Background={null}
          DateInfo={null}
          FeaturedMedia={null}
          Description={null}
          LabelBar={null}
          InfoBar={null}
          TagBar={null}
          isFree={false}
          topLink={null} />
      }
      Body={<Body body={[]} />}
    >
      <div className='body-text'>
        <ul>
          <div className={classNames({
            [spacing({ s: 5 }, {margin: ['top']})]: true
          })}>
            <PrimaryLink url='/whats-on' name='Our exhibitions and events' />
          </div>
          <div className={classNames({
            [spacing({ s: 5 }, {margin: ['top']})]: true
          })}>
            <PrimaryLink url='https://wellcomelibrary.org' name='Our library' />
          </div>
          <div className={classNames({
            [spacing({ s: 5 }, {margin: ['top']})]: true
          })}>
            <PrimaryLink url='/explore' name='Our stories' />
          </div>
          <div className={classNames({
            [spacing({ s: 5 }, {margin: ['top']})]: true
          })}>
            <PrimaryLink url='/books' name='Our books' />
          </div>
          <div className={classNames({
            [spacing({ s: 5 }, {margin: ['top']})]: true
          })}>
            <PrimaryLink url='/works' name='Our images' />
          </div>
          <div className={classNames({
            [spacing({ s: 5 }, {margin: ['top']})]: true
          })}>
            <PrimaryLink url='/pages/Wuw2MSIAACtd3Ssg' name='Our youth programme' />
          </div>
        </ul>
      </div>
    </BasePage>
  );
};

export default BookPage;
