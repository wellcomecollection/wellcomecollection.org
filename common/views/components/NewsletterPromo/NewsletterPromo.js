// @flow
import { useState, useContext } from 'react';
import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';
import Raven from 'raven-js';
import TextInput from '../TextInput/TextInput';
import TogglesContext from '../TogglesContext/TogglesContext';
import { trackEvent } from '../../../utils/ga';

const ErrorMessage = styled(Space).attrs({
  'aria-live': 'polite',
  as: 'p',
  h: { size: 'l', negative: true, properties: ['bottom'] },
  className: classNames({
    'absolute font-red': true,
    [font('hnm', 5)]: true,
  }),
})`
  top: 100%;
`;

const FormElementWrapper = styled.div`
  width: 100%;
  ${props => props.theme.media.medium`
    display: flex;
    flex: 1;
  `}
`;

const NewsletterInput = styled(TextInput).attrs({
  required: true,
  id: 'newsletter-input',
  type: 'email',
  name: 'email',
  label: 'email',
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
  v: { size: 'm', properties: ['margin-bottom'] },
})`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  align-items: flex-start;
  position: relative;

  label {
    flex: 1;
    min-width: 300px;
  }

  ${props => props.theme.media.medium`
    flex-wrap: nowrap;
  `}
`;

const YellowBox = styled(Space).attrs({
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  'aria-live': 'polite',
})`
  border: 12px solid ${props => props.theme.colors.yellow};

  p {
    max-width: 600px;
  }
`;

const BoxInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

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
        trackEvent({
          category: 'NewsletterPromo',
          action: 'submit email',
        });
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
          <div>
            <YellowBox>
              <BoxInner>
                <Space
                  h={{ size: 'm', properties: ['padding-right'] }}
                  v={{ size: 'm', properties: ['margin-bottom'] }}
                >
                  <h2
                    className={classNames({
                      h2: true,
                      'no-margin': !isSuccess,
                    })}
                  >
                    {isSuccess ? 'Thank you for signing up!' : headingText}
                  </h2>
                  {bodyText && (
                    <p
                      className={classNames({
                        [font('hnl', 5)]: true,
                        'no-margin': true,
                      })}
                    >
                      {bodyText}
                    </p>
                  )}
                  {isSuccess && (
                    <div
                      className={classNames({
                        [font('hnl', 5)]: true,
                        'spaced-text': true,
                      })}
                    >
                      <p>
                        If this is the first time you have subscribed to one of
                        our newsletters, you will receive an email asking you to
                        confirm your subscription.
                      </p>
                      <p>
                        To find out more about our Access events, and activities
                        for Young People and Schools, see our{' '}
                        <a href="/newsletter">full list of newsletters</a>.
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
                      <input
                        type="hidden"
                        name="ReturnURL"
                        value="https://wellcomecollection.org/newsletter"
                      />
                      <input type="hidden" name="addressbookid" value="40131" />
                      <FormElementWrapper>
                        <NewsletterInput placeholder="you@example.com" />
                        <NewsletterButton disabled={isSubmitting}>
                          {isSubmitting ? 'Sending…' : 'Subscribe'}
                        </NewsletterButton>
                      </FormElementWrapper>
                    </NewsletterForm>
                  </>
                )}
              </BoxInner>
              {!isSuccess && (
                <p
                  className={classNames({
                    [font('hnl', 6)]: true,
                    'no-margin': true,
                  })}
                  style={{ marginTop: isError ? '16px' : undefined }}
                >
                  <a href="/newsletter">All our newsletters</a>
                </p>
              )}
            </YellowBox>
            <Space
              v={{ size: 'l', properties: ['margin-top'] }}
              style={{ flexBasis: '100%' }}
            >
              <p className={font('hnl', 6)} style={{ maxWidth: '800px' }}>
                We use a third party provider,{' '}
                <a href="https://dotdigital.com/terms/privacy-policy/">
                  dotdigital
                </a>
                , to deliver our newsletters. For information about how we
                handle your data, please read our{' '}
                <a href="https://wellcome.ac.uk/about-us/governance/privacy-and-terms">
                  privacy notice
                </a>
                . You can unsubscribe at any time using links in the emails you
                receive.
              </p>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPromo;
