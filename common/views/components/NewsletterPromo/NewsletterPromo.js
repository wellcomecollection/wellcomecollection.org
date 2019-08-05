// @flow
import Button from '../Buttons/Button/Button';
import { grid, font } from '../../../utils/classnames';
import VerticalSpace from '../styled/VerticalSpace';

const NewsletterPromo = () => (
  <div className="row bg-cream">
    <div className="container">
      <div className="grid">
        <VerticalSpace
          size="l"
          properties={['padding-top', 'padding-bottom']}
          className={grid({ s: 12, m: 12, l: 12, xl: 12 })}
        >
          <h2 className="h2">
            Stay connected with email updates from Wellcome Collection
          </h2>
          <p className={font('hnl', 5)}>
            Be the first to know about our upcoming exhibitions, events and
            other activities, with extra options for youth, schools and access
            events.
          </p>
          <Button
            type="primary"
            extraClasses="btn--primary"
            url="/newsletter"
            text="Sign up"
          />
        </VerticalSpace>
      </div>
    </div>
  </div>
);

export default NewsletterPromo;
