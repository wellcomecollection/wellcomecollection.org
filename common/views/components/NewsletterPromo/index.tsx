import { FunctionComponent, useState } from 'react';
import styled, { useTheme } from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { newsletterAddressBook } from '@weco/common/data/dotdigital';
import useValidation from '@weco/common/hooks/useValidation';
import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import TextInput from '@weco/common/views/components/TextInput';

const NewsletterForm = styled.form.attrs({
  name: 'newsletter-signup',
  id: 'newsletter-signup',
  action: 'https://r1-t.trackedlink.net/signup.ashx',
  method: 'post',
})`
  position: relative;

  ${props => props.theme.makeSpacePropertyValues('sm', ['margin-bottom'])}

  ${props => props.theme.media('sm')`
    min-width: 300px;
  `}
`;

const PrivacyNotice = () => (
  <p className={font('sans', -2)}>
    By clicking subscribe, you agree to receive this newsletter. You can
    unsubscribe any time. For information about how we handle your data,{' '}
    <a
      href="https://wellcome.org/who-we-are/privacy-and-terms"
      target="_blank"
      rel="noopener noreferrer"
    >
      please read our privacy notice
    </a>
    .
  </p>
);

const NewsletterPromo: FunctionComponent = () => {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [hasCheckedMarketing, setHasCheckedMarketing] = useState(false);
  const [value, setValue] = useState('');
  const { isEnhanced } = useAppContext();
  const emailValidation = useValidation();

  async function handleSubmit(event) {
    event.preventDefault();

    emailValidation.setShowValidity(true);

    if (!emailValidation.isValid) {
      setIsSubmitError(false);

      return;
    }

    setIsSubmitting(true);
    setIsSubmitError(false);

    const formEls = [...event.currentTarget.elements];
    const data = {
      addressBookId: formEls.find(el => el.name === 'addressBookId').value,
      emailAddress: formEls.find(el => el.name === 'email').value,
      marketingPermissions: hasCheckedMarketing,
    };

    const response = await fetch('/api/newsletter-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    const { result } = json;

    switch (result) {
      case 'ok':
        setIsSuccess(true);
        break;
      case 'error':
        setIsSubmitError(true);
        emailValidation.setIsValid(false);
    }

    setIsSubmitting(false);
  }

  return (
    <Space
      data-component="newsletter-promo"
      className="is-hidden-print"
      style={{ backgroundColor: theme.color('lightYellow') }}
      $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
    >
      <Container>
        <ContaineredLayout gridSizes={gridSize8()}>
          <h2 className={font('brand-bold', 1)} style={{ textAlign: 'center' }}>
            {isSuccess ? 'Thank you for signing up!' : 'Stay in the know'}
          </h2>
          {!isSuccess && (
            <>
              <p className={font('sans', -1)} style={{ marginBottom: '1rem' }}>
                Sign up to our newsletter to find out what’s on, read our latest
                stories and get involved.
              </p>

              <NewsletterForm onSubmit={handleSubmit} noValidate={isEnhanced}>
                <input
                  type="hidden"
                  name="addressBookId"
                  value={newsletterAddressBook.id}
                />
                <TextInput
                  required={true}
                  id="newsletter-input"
                  type="email"
                  name="email"
                  label="Your email address"
                  hintCopy="For example name@example.com"
                  errorMessage={
                    isSubmitError
                      ? 'There was a problem. Please try again.'
                      : 'Enter an email address in the correct format, like name@example.com'
                  }
                  value={value}
                  setValue={setValue}
                  {...emailValidation}
                />

                <p
                  className={font('sans', -2)}
                  style={{ marginBottom: 0, marginTop: '1rem' }}
                >
                  <a href="/newsletter">All our newsletters</a>
                </p>

                <Space $v={{ size: 'md', properties: ['margin-top'] }}>
                  <CheckboxRadio
                    id="MARKETINGPERMISSIONS"
                    name="cd_MARKETINGPERMISSIONS"
                    type="checkbox"
                    checked={hasCheckedMarketing}
                    onChange={() => {
                      setHasCheckedMarketing(currentValue => !currentValue);
                    }}
                    text={
                      <p className={font('sans', -2)}>
                        Tick this box if you’re happy to receive other emails
                        about Wellcome Collection, upcoming events and
                        exhibitions and/or other relevant opportunities.
                      </p>
                    }
                  />
                </Space>

                <PrivacyNotice />

                <Button
                  variant="ButtonSolid"
                  dataGtmProps={{
                    trigger: 'newsletter_promo_subscribe',
                  }}
                  text={isSubmitting ? 'Sending…' : 'Subscribe'}
                  disabled={isSubmitting}
                />
              </NewsletterForm>
            </>
          )}

          {isSuccess && (
            <div className={`${font('sans', -1)} spaced-text`}>
              <p>
                If this is the first time you have subscribed to one of our
                newsletters, you will receive an email asking you to confirm
                your subscription.
              </p>
              <p>
                To find out more about our Access events, and activities for
                Young People and Schools, see our{' '}
                <a href="/newsletter">full list of newsletters</a>.
              </p>
              <PrivacyNotice />
            </div>
          )}
        </ContaineredLayout>
      </Container>
    </Space>
  );
};

export default NewsletterPromo;
