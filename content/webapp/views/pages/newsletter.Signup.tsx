import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
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
  const { isEnhanced } = useAppContext();
  const [checkedInputs, setCheckedInputs] = useState<string[]>([]);
  const [hasCheckedMarketing, setHasCheckedMarketing] = useState(false);
  const [hasCheckedAudience, setHasCheckedAudience] = useState(false);
  const [noValidate, setNoValidate] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [firstNameValue, setFirstNameValue] = useState('');
  const [lastNameValue, setLastNameValue] = useState('');
  const emailValidation = useValidation();

  function updateCheckedInputs(event: SyntheticEvent<HTMLInputElement>) {
    const isChecked = event.currentTarget.checked;
    const id = event.currentTarget.id;

    const newInputs = isChecked
      ? checkedInputs.concat(id)
      : checkedInputs.filter(c => c !== id);
    setCheckedInputs(newInputs);
  }

  const isButtonDisabled =
    checkedInputs.length === 0 ||
    !firstNameValue.trim() ||
    !lastNameValue.trim() ||
    !emailValidation.isValid;

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    emailValidation.setShowValidity(true);

    if (isButtonDisabled) return;

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
            Sign up to our regular newsletters to explore health and the human
            experience.
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

          <fieldset>
            <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
              <legend className={font('sans-bold', 0)}>
                Select each newsletter you'd like to receive:
              </legend>
            </Space>
            <PlainList style={{ marginBottom: '0' }}>
              <Space as="li" $v={{ size: 'sm', properties: ['margin-bottom'] }}>
                <CheckboxRadio
                  id={newsletterAddressBook.slug}
                  type="checkbox"
                  text={newsletterAddressBook.label}
                  value={`addressbooK_${newsletterAddressBook.id}`}
                  name={`addressbooK_${newsletterAddressBook.id}`}
                  checked={checkedInputs.includes(newsletterAddressBook.slug)}
                  onChange={updateCheckedInputs}
                />
              </Space>
              {secondaryAddressBooks.map((addressBook, index) => (
                <Space
                  as="li"
                  key={addressBook.slug}
                  $v={
                    index < secondaryAddressBooks.length - 1
                      ? { size: 'sm', properties: ['margin-bottom'] }
                      : undefined
                  }
                >
                  <CheckboxRadio
                    id={addressBook.slug}
                    type="checkbox"
                    text={addressBook.label}
                    value={`addressbooK_${addressBook.id}`}
                    name={`addressbooK_${addressBook.id}`}
                    checked={checkedInputs.includes(addressBook.slug)}
                    onChange={updateCheckedInputs}
                  />
                </Space>
              ))}
            </PlainList>
          </fieldset>

          <Space
            $v={{ size: 'lg', properties: ['margin-top', 'margin-bottom'] }}
          >
            <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
              <TextInput
                id="FIRSTNAME"
                label="Your first name"
                name="cd_FIRSTNAME"
                type="text"
                value={firstNameValue}
                setValue={setFirstNameValue}
                required
              />
            </Space>
            <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
              <TextInput
                id="LASTNAME"
                label="Your last name"
                name="cd_LASTNAME"
                type="text"
                value={lastNameValue}
                setValue={setLastNameValue}
                required
              />
            </Space>

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
            $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}
          >
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
            <CheckboxRadio
              id="AUDIENCEPERMISSIONS"
              name="cd_AUDIENCEPERMISSIONS"
              type="checkbox"
              checked={hasCheckedAudience}
              onChange={() => {
                setHasCheckedAudience(currentValue => !currentValue);
              }}
              text={
                <p className={font('sans', -2)}>
                  Tick this box if you’d be happy for us to use your information
                  to help us understand our audience, and show you relevant
                  adverts about Wellcome Collection on social networks (such as
                  Facebook, Instagram and LinkedIn).
                </p>
              }
            />
            <p className={font('sans', -2)}>
              By clicking subscribe, you agree to receive this newsletter. You
              can unsubscribe any time. For information about how we handle your
              data,{' '}
              <a
                href="https://wellcome.org/who-we-are/privacy-and-terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                please read our privacy notice
              </a>
              .
            </p>
          </Space>

          <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
            <Button
              disabled={isEnhanced && isButtonDisabled}
              variant="ButtonSolid"
              text={`Subscribe to your newsletter${checkedInputs.length > 1 ? 's' : ''}`}
              dataGtmProps={{
                trigger: 'newsletter_signup_subscribe',
              }}
            />
          </Space>
        </form>
      )}
    </>
  );
};

export default NewsletterSignup;
