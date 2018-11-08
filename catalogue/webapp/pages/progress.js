// @flow
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import {spacing, grid} from '@weco/common/utils/classnames';

const ProgressPage = () => (
  <div className={`row ${spacing({s: 5}, {padding: ['top']})}`}>
    <div className='container'>
      <div className='grid'>
        <div className={`${grid({s: 12, m: 11, l: 8, xl: 7})}`}>
          <div className='body-text'>
            <h1>Progress</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PageWrapper(ProgressPage);
