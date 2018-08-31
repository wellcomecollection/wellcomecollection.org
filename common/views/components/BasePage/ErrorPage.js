// @flow
import {classNames, spacing} from '../../../utils/classnames';
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import PrimaryLink from '../Links/PrimaryLink/PrimaryLink';

type Props = {|
  errorStatus: number
|}

const ErrorPage = ({ errorStatus }: Props) => {
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

        <div className={classNames({
          [spacing({ s: 10 }, {margin: ['top']})]: true
        })}>
          <h2 className='h2'>Looking for something published before 2018?</h2>
          <p>
            Our websites have been archived by the{' '}
            <a href='https://archive.org'>Internet Archive</a> in its{' '}
            <a href='https://web.archive.org/'>Wayback Machine</a>.
          </p>
          <PrimaryLink
            url='https://web.archive.org/web/*/wellcomecollection.org'
            name='See the Wellcome Collection website from 2007-present' />

          <div className={classNames({
            [spacing({ s: 5 }, {margin: ['top']})]: true
          })}>
            <PrimaryLink
              url='https://web.archive.org/web/*/blog.wellcomecollection.org'
              name='Read blog posts from 2013-2017' />
          </div>
        </div>

        <div className={classNames({
          [spacing({ s: 5 }, {margin: ['top']})]: true
        })}>
          <p>
            If you{`'`}re looking for something specific you{`'`}d love to see return to
            this website, email us at{' '}
            <a href='mailto:digital@wellcomecollection.org'>
              digital@wellcomecollection.org
            </a>.
          </p>
        </div>
      </div>
    </BasePage>
  );
};

export default ErrorPage;
