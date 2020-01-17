// @flow
import { useState, useContext } from 'react';
import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';
import Raven from 'raven-js';
import TextInput from '../TextInput/TextInput';
import TogglesContext from '../TogglesContext/TogglesContext';

const ErrorMessage = styled(Space).attrs({
  'aria-live': 'polite',
  as: 'p',
  h: { size: 'l', negative: true, properties: ['bottom'] },
  className: classNames({
    absolute: true,
    [font('hnm', 5)]: true,
  }),
})`
  top: 100%;
`;

const NewsletterInput = styled(TextInput).attrs({
  required: true,
  id: 'newsletter-input',
  type: 'email',
  name: 'email',
})``;

const NewsletterButton = styled.button.attrs({
  className: classNames({
    'btn btn--primary': true,
    [font('hnm', 5)]: true,
  }),
})`
  width: 100%;
  margin-top: 10px;

  ${props => props.theme.media.medium`
    width: auto;
    margin-left: 10px;
    margin-top: 0;
  `}
`;

const NewsletterForm = styled(Space).attrs({
  as: 'form',
  name: 'newsletter-signup',
  id: 'newsletter-signup',
  action: 'https://r1-t.trackedlink.net/signup.ashx',
  method: 'post',
})`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  align-items: flex-start;

  label {
    flex: 1;
    min-width: 320px;
  }

  ${props => props.theme.media.medium`
    flex-wrap: nowrap;
  `}
`;

const YellowBox = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  border: 12px solid ${props => props.theme.colors.yellow};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  ${props => props.theme.media.xlarge`
    flex-wrap: nowrap;
  `}
`;

const NewsletterPromo = () => {
  const { altNewsletterSignupCopy } = useContext(TogglesContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const headingText = altNewsletterSignupCopy
    ? 'Stay in the know'
    : `Sign up to our newsletter`;

  const bodyText =
    altNewsletterSignupCopy &&
    'Find out what’s on, read our latest stories and get involved.';

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
    <div className="row">
      <div className="container">
        <div className="flex flex--h-center">
          <YellowBox>
            <Space
              h={{ size: 'm', properties: ['padding-right'] }}
              v={{ size: 'm', properties: ['margin-bottom'] }}
            >
              <h2 className="h2">
                {isSuccess ? 'Thank you for signing up!' : headingText}
              </h2>
              {bodyText && <p className={font('hnl', 5)}>{bodyText}</p>}
              {isSuccess && (
                <div
                  className={classNames({
                    [font('hnl', 5)]: true,
                  })}
                >
                  <p>
                    If this is the first time you have subscribed to one of our
                    newsletters, you will receive an email asking you to confirm
                    your subscription.
                  </p>
                  <p>
                    To find out more about our Access events, and activities for
                    Young People and Schools, see our{' '}
                    <a href="/newsletters">full list of newsletters</a>.
                  </p>
                </div>
              )}
            </Space>
            {!isSuccess && (
              <>
                <NewsletterForm onSubmit={handleSubmit}>
                  {isError && (
                    <ErrorMessage>
                      There was a problem. Please try again.
                    </ErrorMessage>
                  )}
                  <input type="hidden" name="userid" value="225683" />
                  <input
                    type="hidden"
                    name="SIG22a9ece3ebe9b2e10e328f234fd10b3f5686b9f4d45f628f08852417032dc990"
                    value=""
                  />
                  <input type="hidden" name="ReturnURL" value="" />
                  <input type="hidden" name="addressbookid" value="40131" />

                  <label
                    htmlFor="newsletter-signup"
                    className="visually-hidden"
                  >
                    email
                  </label>

                  <NewsletterInput placeholder="you@example.com" />
                  <NewsletterButton disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Subscribe'}
                  </NewsletterButton>
                </NewsletterForm>

                {/* <Space v={{ size: 'l', properties: ['margin-top'] }}>
                  <p
                    className={classNames({
                      'no-margin': true,
                      [font('hnl', 6)]: true,
                    })}
                  >
                    <a href="/newsletter">All newsletters</a> |{' '}
                    <a href="https://wellcome.ac.uk/about-us/governance/privacy-and-terms">
                      Privacy notice
                    </a>
                  </p>
                </Space> */}
              </>
            )}
          </YellowBox>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPromo;
