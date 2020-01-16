// @flow
import { useState } from 'react';
import { grid, font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Layout from '../Layout/Layout';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';
import Raven from 'raven-js';

const NewsletterInput = styled(Space).attrs({
  as: 'input',
  required: true,
  id: 'newsletter-input',
  type: 'email',
  name: 'email',
  h: { size: 's', properties: ['margin-right'] },
  className: classNames({
    'rounded-corners': true,
  }),
})`
  min-width: 280px;
  padding: 10px;
  appearance: none;
  border: 1px solid grey;
`;

const NewsletterForm = styled(Space).attrs({
  as: 'form',
  name: 'newsletter-signup',
  id: 'newsletter-signup',
  action: 'https://r1-t.trackedlink.net/signup.ashx',
  method: 'post',
  className: classNames({
    'flex flex--v-center flex--wrap': true,
  }),
})`
  width: 100%;
  height: 100%;
  min-height: 120px;
`;

const ErrorMessage = styled(Space).attrs({
  'aria-live': 'polite',
  as: 'p',
  h: { size: 'l', negative: true, properties: ['top'] },
  className: classNames({
    'absolute font-white': true,
    [font('hnm', 5)]: true,
  }),
})`
  bottom: 100%;
`;

const NewsletterPromo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setIsError(false);

    const formEls = [...event.currentTarget.elements];
    const data = {
      addressbookid: formEls.find(el => el.name === 'addressbookid').value,
      email: formEls.find(el => el.name === 'email').value,
    };

    const response = await fetch('/newsletter-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    const { status } = json;

    switch (status) {
      case 'ContactChallenged':
      case 'PendingOptIn':
      case 'Subscribed':
        setIsSuccess(true);
        break;
      default:
        setIsError(true);

        Raven.captureException(new Error(`Newsletter signup error: ${status}`));
    }

    setIsSubmitting(false);
  }

  return (
    <div className="row bg-teal">
      <Layout gridSizes={{ s: 12, m: 12, l: 12, xl: 12 }}>
        <div
          className={classNames({
            grid: true,
          })}
        >
          <>
            <div
              className={classNames({
                [grid({ s: 12, m: 12, l: 6, xl: 6 })]: true,
              })}
            >
              <Space
                v={{
                  size: 'xl',
                  properties: ['padding-top', 'padding-bottom'],
                }}
                h={{
                  size: 'm',
                  properties: ['padding-left', 'padding-right'],
                }}
              >
                <Space
                  as="h2"
                  v={{ size: 's', properties: ['margin-bottom'] }}
                  className={classNames({
                    'h1 font-white': true,
                  })}
                >
                  {isSuccess ? 'Thanks for signing up' : 'Want to know more?'}
                </Space>
                {isSuccess ? (
                  <p
                    className={classNames({
                      [font('hnl', 4)]: true,
                      'font-white no-margin': true,
                    })}
                  >
                    If this is the first time you’ve subscribed to updates from
                    us, you will receive an email asking you to confirm. Please
                    check your email and click the button. Thank you!
                  </p>
                ) : (
                  <p
                    className={classNames({
                      [font('hnl', 4)]: true,
                      'font-white no-margin': true,
                    })}
                  >
                    Sign up to our newsletter to be the first to know about our
                    latest exhibitions, events, stories and opportunities to get
                    involved. For information about how we handle your data,
                    read our{' '}
                    <a href="https://wellcome.ac.uk/about-us/terms-of-use">
                      privacy page
                    </a>
                    .
                  </p>
                )}
              </Space>
            </div>
            {!isSuccess && (
              <div
                className={classNames({
                  [grid({ s: 12, m: 12, l: 6, xl: 6 })]: true,
                })}
              >
                <NewsletterForm
                  onSubmit={handleSubmit}
                  v={{
                    size: 'm',
                    properties: ['padding-top', 'padding-bottom'],
                  }}
                  h={{
                    size: 'm',
                    properties: ['padding-left', 'padding-right'],
                  }}
                >
                  <input type="hidden" name="userid" value="225683" />
                  <input
                    type="hidden"
                    name="SIG22a9ece3ebe9b2e10e328f234fd10b3f5686b9f4d45f628f08852417032dc990"
                    value=""
                  />
                  <input type="hidden" name="ReturnURL" value="" />
                  <input type="hidden" name="addressbookid" value="40131" />
                  <div>
                    <div className="flex relative">
                      {isError && (
                        <ErrorMessage>
                          There was a problem. Please try again.
                        </ErrorMessage>
                      )}
                      <label
                        htmlFor="newsletter-signup"
                        className="visually-hidden"
                      >
                        email
                      </label>
                      <NewsletterInput placeholder="you@example.com" />
                      <button
                        className="btn btn--secondary font-size-4 font-family-hnm"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending…' : 'Subscribe'}
                      </button>
                    </div>
                    <Space v={{ size: 'm', properties: ['margin-top'] }}>
                      <p
                        className={classNames({
                          'font-white no-margin': true,
                          [font('hnl', 5)]: true,
                        })}
                      >
                        Or find out more about{' '}
                        <a href="/newsletter">all our newsletters</a>.
                      </p>
                    </Space>
                  </div>
                </NewsletterForm>
              </div>
            )}
          </>
        </div>
      </Layout>
    </div>
  );
};

export default NewsletterPromo;
