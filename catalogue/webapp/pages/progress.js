// @flow
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import {spacing, grid} from '@weco/common/utils/classnames';
import ReactMarkdown from 'react-markdown';
import PROGRESS_NOTES from './PROGRESS_NOTES.md';

const ProgressPage = () => (
  <div className={`row ${spacing({s: 5}, {padding: ['top']})}`}>
    <div className='container'>
      <div className='grid'>
        <div className={`${grid({s: 12, m: 11, l: 8, xl: 7})}`}>
          <div className='body-text'>
            <ReactMarkdown source={PROGRESS_NOTES} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PageWrapper(ProgressPage);
