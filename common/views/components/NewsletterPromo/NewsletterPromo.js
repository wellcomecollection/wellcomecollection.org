// @flow
import Button from '../Buttons/Button/Button';
import { grid, font, classNames } from '../../../utils/classnames';
import RepeatingLs from '../RepeatingLs/RepeatingLs';
import Space from '../styled/Space';
import Layout from '../Layout/Layout';

const NewsletterPromo = () => (
  <div className="row">
    <Layout gridSizes={{ s: 12, m: 12, l: 12, xl: 12 }}>
      <Space
        v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
        className="bg-purple"
      >
        <div
          className={classNames({
            grid: true,
          })}
        >
          <div
            className={classNames({
              [grid({ s: 12, m: 6, l: 6, xl: 6 })]: true,
            })}
          >
            <Space
              v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
              h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
            >
              <h2
                className={classNames({
                  'h2 font-white': true,
                })}
              >
                Stay connected with email updates from Wellcome Collection
              </h2>
              <p
                className={classNames({
                  [font('hnl', 4)]: true,
                  'font-white': true,
                })}
              >
                Be the first to know about our upcoming exhibitions, events and
                other activities, with extra options for youth, schools and
                access events.
              </p>
            </Space>
          </div>
          <div
            className={classNames({
              [grid({ s: 12, m: 6, l: 4, shiftL: 2, xl: 4, shiftXl: 2 })]: true,
            })}
          >
            <Space
              v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
              h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
              style={{ width: '100%', height: '100%' }}
              className={classNames({
                relative: true,
                'flex flex--v-center': true,
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
      </Space>
    </Layout>
  </div>
);

export default NewsletterPromo;
