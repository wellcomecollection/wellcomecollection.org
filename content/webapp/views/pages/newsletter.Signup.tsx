import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  newsletterAddressBook,
  secondaryAddressBooks,
} from '@weco/common/data/dotdigital';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import useValidation from '@weco/common/hooks/useValidation';
import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio';
import Space from '@weco/common/views/components/styled/Space';
import TextInput from '@weco/common/views/components/TextInput';

const PlainList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 0;
`;

type Props = {
  isSuccess?: boolean;
  isError?: boolean;
  isConfirmed?: boolean;
};

const NewsletterSignup: FunctionComponent<Props> = ({
  isSuccess,
  isError,
  isConfirmed,
}: Props) => {
  const [checkedInputs, setCheckedInputs] = useState<string[]>([]);
  const [hasCheckedMarketing, setHasCheckedMarketing] = useState(false);
  const [noValidate, setNoValidate] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const emailValidation = useValidation();

  function updateCheckedInputs(event: SyntheticEvent<HTMLInputElement>) {
    const isChecked = event.currentTarget.checked;
    const id = event.currentTarget.id;

    const newInputs = isChecked
      ? checkedInputs.concat(id)
      : checkedInputs.filter(c => c !== id);
    setCheckedInputs(newInputs);
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    emailValidation.setShowValidity(true);

    if (!emailValidation.isValid) return;

    event.currentTarget.submit();
  }

  useEffect(() => {
    setNoValidate(true);
  }, []);

  return (
    <>
      {isConfirmed && (
        <div className="body-text">
          <p className={font('sans-bold', 1)}>
            Thank you for confirming your email address
          </p>
          <p>
            We’re looking forward to keeping you up-to-date on the topics you’re
            interested in. You are seeing this page because you clicked on a
            confirmation link in an email from us, but you can unsubscribe or
            change your subscription preferences at any time using the link in
            the emails you receive.
          </p>
          <p>
            <a href={`/${prismicPageIds.whatsOn}`}>
              Browse our current and upcoming exhibitions and events
            </a>
            .
          </p>
        </div>
      )}

      {isSuccess && (
        <div className="body-text">
          <p className={font('sans-bold', 1)}>You’re signed up</p>
          <p>
            If this is the first time you’ve subscribed to updates from us, you
            will receive an email asking you to confirm. Please check your email
            and click the button. Thank you!
          </p>
        </div>
      )}

      {isError && (
        <div className="body-text">
          <p className={font('sans-bold', 1)}>Sorry, there’s been a problem</p>
          <p>Please try again.</p>
        </div>
      )}

      {!isConfirmed && !isSuccess && !isError && (
        <Space
          className="body-text"
          $v={{ size: 'sm', properties: ['margin-bottom'] }}
        >
          <p className={font('sans-bold', 1)} style={{ marginBottom: '1rem' }}>
            Want to hear more from us?
          </p>
          <p>
            Sign up to our newsletter to find out what’s on, read our latest
            stories and get involved.
          </p>
        </Space>
      )}

      {!isConfirmed && !isSuccess && (
        <form
          noValidate={noValidate}
          onSubmit={handleSubmit}
          name="newsletter-signup"
          id="newsletter-signup"
          action="https://r1-t.trackedlink.net/signup.ashx"
          method="post"
        >
          {/* The hidden inputs below are required by dotmailer */}
          <input type="hidden" name="userid" value="225683" />
          <input
            type="hidden"
            name="ReturnURL"
            value="https://wellcomecollection.org/newsletter"
          />
          <input
            type="hidden"
            name="SIG22a9ece3ebe9b2e10e328f234fd10b3f5686b9f4d45f628f08852417032dc990"
            value=""
          />

          {/* Subscribes user to What's On/default newsletter */}
          <input
            type="hidden"
            name="addressBookId"
            value={newsletterAddressBook.id}
          />

          <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
            <TextInput
              id="email"
              label="Your email address"
              name="Email"
              type="email"
              value={emailValue}
              setValue={setEmailValue}
              errorMessage="Enter an email address in the correct format, like name@example.com"
              required
              {...emailValidation}
            />
          </Space>

          <Space
            as="fieldset"
            $v={{ size: '2xs', properties: ['margin-bottom'] }}
          >
            <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
              <legend className={font('sans-bold', 0)}>
                You might also be interested in receiving updates on:
              </legend>
            </Space>
            <PlainList>
              {secondaryAddressBooks.map(addressBook => (
                <Space
                  as="li"
                  key={addressBook.slug}
                  $v={{ size: 'sm', properties: ['margin-bottom'] }}
                >
                  <CheckboxRadio
                    id={addressBook.slug}
                    type="checkbox"
                    text={addressBook.label}
                    // This might benefit from a review once in a while, it seems that the name
                    // of the field has changed sometime between 2022 and 2023, which stopped new
                    // subscriptions
                    value={`addressbooK_${addressBook.id}`}
                    name={`addressbooK_${addressBook.id}`}
                    checked={checkedInputs.includes(addressBook.slug)}
                    onChange={updateCheckedInputs}
                  />
                </Space>
              ))}
            </PlainList>

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
                    Tick this box if you’re happy to receive other emails about
                    Wellcome Collection, upcoming events and exhibitions and/or
                    other relevant opportunities.
                  </p>
                }
              />
            </Space>
          </Space>

          <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
            <Button
              variant="ButtonSolid"
              text="Subscribe"
              dataGtmProps={{
                trigger: 'newsletter_signup_subscribe',
              }}
            />
          </Space>

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
        </form>
      )}
    </>
  );
};

export default NewsletterSignup;
