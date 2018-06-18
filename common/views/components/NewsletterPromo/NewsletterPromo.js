// @flow
import Button from '../Buttons/Button/Button';
import {grid, spacing, font} from '../../../utils/classnames';

const NewsletterPromo = () => (
  <div className='row bg-cream'>
    <div className='container'>
      <div className='grid'>
        <div className={`${grid({s: 12, m: 12, l: 12, xl: 12})} ${spacing({s: 4}, {padding: ['top']})} ${spacing({s: 8}, {padding: ['bottom']})}`}>
          <h2 className='h2'>Stay connected with email updates from Wellcome Collection</h2>
          <p className={font({s: 'HNL4'})}>Be the first to know about our upcoming exhibitions, events and other activities, with extra options for youth, schools and access events.</p>
          <Button
            type='primary'
            extraClasses='btn--primary'
            url='/newsletter'
            text='Sign up' />
        </div>
      </div>
    </div>
  </div>
);

export default NewsletterPromo;
