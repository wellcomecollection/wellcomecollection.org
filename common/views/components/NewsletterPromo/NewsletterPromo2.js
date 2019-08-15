// @flow
import Button from '../Buttons/Button/Button';
import { grid, font, classNames } from '../../../utils/classnames';
import RepeatingLs from '../RepeatingLs/RepeatingLs';
import Space from '../styled/Space';

const NewsletterPromo = () => (
  <div className="row">
    <div className="container">
      <div
        className={classNames({
          'grid bg-purple': true,
        })}
      >
        <div
          className={classNames({
            [grid({ s: 12, m: 6, l: 6, xl: 6 })]: true,
          })}
        >
          <Space
            as="p"
            v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}
            className={classNames({
              [font('hnl', 4)]: true,
              'font-white': true,
            })}
          >
            Be the first to know about our upcoming exhibitions, events and
            other activities, with extra options for youth, schools and access
            events.
          </Space>
          <h2
            className={classNames({
              'h2 font-white': true,
            })}
          >
            Stay connected with email updates from Wellcome Collection
          </h2>
        </div>
        <Space
          v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
          h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
          className={classNames({
            relative: true,
            'flex flex--v-center': true,
            [grid({ s: 12, m: 6, l: 4, shiftL: 2, xl: 4, shiftXl: 2 })]: true,
          })}
        >
          <RepeatingLs foreground={'yellow'} background={'purple'} />

          <Button
            type="secondary"
            extraClasses="btn--primary relative"
            url="/newsletter"
            text="Sign up"
          />
        </Space>
      </div>
    </div>
  </div>
);

export default NewsletterPromo;
