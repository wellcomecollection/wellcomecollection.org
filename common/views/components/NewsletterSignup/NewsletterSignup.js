// @flow
import { useState, useEffect } from 'react';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Checkbox from '@weco/common/views/components/Checkbox/Checkbox';
import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';

type Props = {|
  isSuccess?: boolean,
  isError?: boolean,
  isConfirmed?: boolean,
|};

const addressBooks = [
  {
    id: 'accessibility',
    label: `Access events, tours and activities`,
    name: 'addressbook_40129',
  },
  {
    id: 'young_people_14-19',
    label: `Events and activities for 14-to-19-year-olds`,
    name: 'addressbook_40132',
  },
  {
    id: 'teachers',
    label: `Events and activities for teachers and schools`,
    name: 'addressbook_40130',
    description: `Study days and other events for secondary school teachers and school groups`,
  },
  {
    id: 'youth_and_community_workers',
    label: `Updates for youth and community workers`,
    name: 'addressbook_40133',
  },
];

const NewsletterSignup = ({ isSuccess, isError, isConfirmed }: Props) => {
  const [checkedInputs, setCheckedInputs] = useState([]);
  const [isEmailError, setIsEmailError] = useState(true);
  const [isCheckboxError, setIsCheckboxError] = useState(true);
  const [noValidate, setNoValidate] = useState(false);
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  function updateCheckedInputs(event: SyntheticEvent<HTMLInputElement>) {
    const isChecked = event.currentTarget.checked;
    const id = event.currentTarget.id;

    const newInputs = isChecked
      ? checkedInputs.concat(id)
      : checkedInputs.filter(c => c !== id);
    setCheckedInputs(newInputs);
    setIsCheckboxError(newInputs.length === 0);
  }

  function handleEmailInput(event: SyntheticEvent<HTMLInputElement>) {
    setIsEmailError(!event.currentTarget.validity.valid);
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitAttempted(true);
    if (!isCheckboxError && !isEmailError) {
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
          <p
            className={classNames({
              [font('hnm', 3)]: true,
            })}
          >
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
          <p
            className={classNames({
              [font('hnm', 3)]: true,
            })}
          >
            You’re signed up
          </p>
          <p>
            If this is the first time you’ve subscribed to updates from us, you
            will receive an email asking you to confirm. Please check your email
            and click the button. Thank you!
          </p>
        </div>
      )}

      {isError && (
        <div className="body-text">
          <p
            className={classNames({
              [font('hnm', 3)]: true,
            })}
          >
            Sorry, there’s been a problem
          </p>
          <p>Please try again.</p>
        </div>
      )}

      {!isConfirmed && !isSuccess && !isError && (
        <div className="body-text">
          <p
            className={classNames({
              [font('hnm', 3)]: true,
            })}
          >
            Want to hear more from Wellcome Collection?
          </p>
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

          <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
            <TextInput
              label="Your email address"
              placeholder="Your email address"
              name="Email"
              type="email"
              onChange={handleEmailInput}
              required
            />
          </Space>

          <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
            <Checkbox
              id="whats_on"
              text="I'd like to receive regular updates from the Wellcome Collection"
              value="addressbook_40131"
              name="addressbook_40131"
              checked={checkedInputs.includes('whats_on')}
              onChange={updateCheckedInputs}
            />
          </Space>

          <Space v={{ size: 's', properties: ['margin-bottom'] }} as="fieldset">
            <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
              <legend
                className={classNames({
                  [font('hnm', 4)]: true,
                })}
              >
                You might also be interested in receiving special updates on:
              </legend>
            </Space>
            <ul className="plain-list no-padding">
              {addressBooks.map(addressBook => (
                <Space
                  as="li"
                  v={{ size: 'm', properties: ['margin-bottom'] }}
                  key={addressBook.id}
                >
                  <Checkbox
                    id={addressBook.id}
                    text={addressBook.label}
                    value={addressBook.name}
                    name={addressBook.name}
                    checked={checkedInputs.includes(addressBook.id)}
                    onChange={updateCheckedInputs}
                  />
                </Space>
              ))}
            </ul>
          </Space>

          <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
            <button className="btn btn--primary">Subscribe</button>
          </Space>

          {isEmailError && isSubmitAttempted && (
            <Space
              as="p"
              v={{
                size: 's',
                properties: [
                  'padding-top',
                  'padding-bottom',
                  'margin-top',
                  'margin-bottom',
                ],
              }}
              h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
              className={`border-width-1 border-color-red font-red`}
            >
              Please enter a valid email address.
            </Space>
          )}

          {isCheckboxError && isSubmitAttempted && (
            <Space
              as="p"
              v={{
                size: 's',
                properties: [
                  'padding-top',
                  'padding-bottom',
                  'margin-top',
                  'margin-bottom',
                ],
              }}
              h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
              className={`border-width-1 border-color-red font-red`}
            >
              Please select at least one option.
            </Space>
          )}

          <p className={`${font('hnl', 6)}`}>
            We use a third-party provider,{' '}
            <a href="https://dotdigital.com/terms/privacy-policy/">
              dotdigital
            </a>
            , to deliver our newsletters. For information about how we handle
            your data, please read our{' '}
            <a href="https://wellcome.ac.uk/about-us/privacy-and-terms">
              privacy notice
            </a>
            . You can unsubscribe at any time using links in the emails you
            receive.
          </p>
        </form>
      )}
    </>
  );
};

export default NewsletterSignup;
