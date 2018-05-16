// @flow
import Button from '../Buttons/Button/Button';
import {grid, spacing} from '../../../utils/classnames';

const NewsletterPromo = () => (
  <div className='row bg-cream'>
    <div className='container'>
      <div className='grid'>
        <div className={`${grid({s: 12, m: 12, l: 12, xl: 12})} ${spacing({s: 4}, {padding: ['top', 'bottom']})}`}>
          <h2 className='h2'>Get the latest email updates</h2>
          <p>Be the first to know about upcoming exhibitions, events and more for everyone including youth and access needs.</p>
          <Button
            type='primary'
            extraClasses='btn--primary'
            url='/info/newsletter'
            text='Sign up' />
        </div>
      </div>
    </div>
  </div>
);

export default NewsletterPromo;
