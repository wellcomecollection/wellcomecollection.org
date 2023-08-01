import { SyntheticEvent, useState, useEffect, FunctionComponent } from 'react';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import useValidation from '@weco/common/hooks/useValidation';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import styled from 'styled-components';
import { secondaryAddressBooks } from '@weco/common/data/dotdigital';

const ErrorBox = styled(Space).attrs({
  v: {
    size: 's',
    properties: [
      'padding-top',
      'padding-bottom',
      'margin-top',
      'margin-bottom',
    ],
  },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  border: 1px solid ${props => props.theme.color('validation.red')};
  color: ${props => props.theme.color('validation.red')};
`;

const PlainList = styled.ul`
  list-style: none;
  padding: 0;
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
  const [isCheckboxError, setIsCheckboxError] = useState(true);
  const [noValidate, setNoValidate] = useState(false);
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const emailValidation = useValidation();

  function updateCheckedInputs(event: SyntheticEvent<HTMLInputElement>) {
    const isChecked = event.currentTarget.checked;
    const id = event.currentTarget.id;

    const newInputs = isChecked
      ? checkedInputs.concat(id)
      : checkedInputs.filter(c => c !== id);
    setCheckedInputs(newInputs);
    setIsCheckboxError(newInputs.length === 0);
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitAttempted(true);

    emailValidation.setShowValidity(true);

    if (!emailValidation.isValid) return;

    if (!isCheckboxError) {
      event.currentTarget.submit();
    }
  }

  useEffect(() => {
    setNoValidate(true);
  }, []);

  return (
    <>
      {isConfirmed && (
        <div className="body-text">
          <p className={font('intb', 3)}>
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
            <a href="/whats-on">
              Browse our current and upcoming exhibitions and events
            </a>
            .
          </p>
        </div>
      )}

      {isSuccess && (
        <div className="body-text">
          <p className={font('intb', 3)}>You’re signed up</p>
          <p>
            If this is the first time you’ve subscribed to updates from us, you
            will receive an email asking you to confirm. Please check your email
            and click the button. Thank you!
          </p>
        </div>
      )}

      {isError && (
        <div className="body-text">
          <p className={font('intb', 3)}>Sorry, there’s been a problem</p>
          <p>Please try again.</p>
        </div>
      )}

      {!isConfirmed && !isSuccess && !isError && (
        <div className="body-text">
          <p className={font('intb', 3)}>Want to hear more from us?</p>
        </div>
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

          <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
            <TextInput
              id="email"
              label="Your email address"
              name="Email"
              type="email"
              required={true}
              big={true}
              value={emailValue}
              setValue={setEmailValue}
              errorMessage="Enter a valid email address."
              {...emailValidation}
            />
          </Space>

          <Space v={{ size: 's', properties: ['margin-bottom'] }} as="fieldset">
            <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
              <legend className={font('intb', 4)}>
                You might also be interested in receiving updates on:
              </legend>
            </Space>
            <PlainList>
              {secondaryAddressBooks.map(addressBook => (
                <Space
                  as="li"
                  v={{ size: 'm', properties: ['margin-bottom'] }}
                  key={addressBook.slug}
                >
                  <CheckboxRadio
                    id={addressBook.slug}
                    type="checkbox"
                    text={addressBook.label}
                    value={`address_${addressBook.id}`}
                    name={`address_${addressBook.id}`}
                    checked={checkedInputs.includes(addressBook.slug)}
                    onChange={updateCheckedInputs}
                  />
                </Space>
              ))}
            </PlainList>
          </Space>

          <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
            <ButtonSolid
              text="Subscribe"
              dataGtmTrigger="newsletter_signup_subscribe"
            />
          </Space>

          {isCheckboxError && isSubmitAttempted && (
            <div role="status">
              <ErrorBox as="p">Please select at least one option.</ErrorBox>
            </div>
          )}

          <p className={font('intr', 6)}>
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
