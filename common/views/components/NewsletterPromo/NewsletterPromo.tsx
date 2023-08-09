import { useState, useContext, FunctionComponent } from 'react';
import styled from 'styled-components';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { font } from '@weco/common/utils/classnames';
import Space from '../styled/Space';
import TextInput from '../TextInput/TextInput';
import { trackGaEvent } from '@weco/common/utils/ga';
import useValidation from '@weco/common/hooks/useValidation';
import ButtonSolid from '../ButtonSolid/ButtonSolid';
import { newsletterAddressBook } from '@weco/common/data/dotdigital';
import { Container } from '@weco/common/views/components/styled/Container';

const FormElementWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 10px;

  > * {
    width: 100%;
  }

  ${props => props.theme.media('medium')`
    flex-wrap: nowrap;
    align-items: stretch;

    > * {
      width: auto;
    }
  `}
`;

const ButtonWrap = styled.div`
  button {
    height: 100%;
    width: 100%;
  }
`;

const NewsletterForm = styled.form.attrs({
  name: 'newsletter-signup',
  id: 'newsletter-signup',
  action: 'https://r1-t.trackedlink.net/signup.ashx',
  method: 'post',
})`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  align-items: flex-start;
  position: relative;

  label {
    flex: 1;
  }

  ${props => props.theme.makeSpacePropertyValues('m', ['margin-bottom'])}

  ${props => props.theme.media('medium')`
    flex-wrap: nowrap;
    min-width: 300px;
  `}
`;

const YellowBox = styled(Space).attrs({
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  'aria-live': 'polite',
})`
  border: 12px solid ${props => props.theme.color('yellow')};

  p {
    max-width: 600px;
  }
`;

const BoxInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  ${props => props.theme.media('xlarge')`
    flex-wrap: nowrap;
  `}
`;

const CopyWrap = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-right'] },
  v: { size: 'm', properties: ['margin-bottom'] },
})`
  flex-basis: 100%;

  ${props => props.theme.media('medium')`
    flex-basis: auto;
  `}
`;

const NewsletterPromo: FunctionComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [value, setValue] = useState('');
  const { isEnhanced } = useContext(AppContext);
  const emailValidation = useValidation();

  const headingText = 'Stay in the know';
  const bodyText =
    'Find out what’s on, read our latest stories and get involved.';

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
        trackGaEvent({ category: 'NewsletterPromo', action: 'submit email' });
        break;
      case 'error':
        setIsSubmitError(true);
        emailValidation.setIsValid(false);
    }

    setIsSubmitting(false);
  }

  return (
    <div className="is-hidden-print">
      <Container>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <YellowBox>
              <BoxInner>
                <CopyWrap>
                  <h2
                    className={font('wb', 3)}
                    style={{ marginBottom: !isSuccess ? 0 : undefined }}
                  >
                    {isSuccess ? 'Thank you for signing up!' : headingText}
                  </h2>
                  {!isSuccess && (
                    <p className={font('intr', 5)} style={{ marginBottom: 0 }}>
                      {bodyText}
                    </p>
                  )}
                  {isSuccess && (
                    <div className={`${font('intr', 5)} spaced-text`}>
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
                </CopyWrap>
                {!isSuccess && (
                  <>
                    <NewsletterForm
                      onSubmit={handleSubmit}
                      noValidate={isEnhanced}
                    >
                      <input
                        type="hidden"
                        name="addressBookId"
                        value={newsletterAddressBook.id}
                      />
                      <FormElementWrapper>
                        <TextInput
                          required={true}
                          id="newsletter-input"
                          type="email"
                          name="email"
                          label="Your email address"
                          errorMessage={
                            isSubmitError
                              ? 'There was a problem. Please try again.'
                              : 'Enter a valid email address.'
                          }
                          value={value}
                          setValue={setValue}
                          {...emailValidation}
                        />
                        <ButtonWrap>
                          <ButtonSolid
                            dataGtmTrigger="newsletter_promo_subscribe"
                            text={isSubmitting ? 'Sending…' : 'Subscribe'}
                            disabled={isSubmitting}
                          />
                        </ButtonWrap>
                      </FormElementWrapper>
                    </NewsletterForm>
                  </>
                )}
              </BoxInner>
              {!isSuccess && (
                <p className={font('intr', 6)} style={{ marginBottom: 0 }}>
                  <a href="/newsletter">All our newsletters</a>
                </p>
              )}
            </YellowBox>
            <Space
              v={{ size: 'l', properties: ['margin-top'] }}
              style={{ flexBasis: '100%' }}
            >
              <p className={font('intr', 6)} style={{ maxWidth: '800px' }}>
                We use a third party provider,{' '}
                <a href="https://dotdigital.com/terms/privacy-policy/">
                  dotdigital
                </a>
                , to deliver our newsletters. For information about how we
                handle your data, please read our{' '}
                <a href="https://wellcome.org/who-we-are/privacy-and-terms">
                  privacy notice
                </a>
                . You can unsubscribe at any time using links in the emails you
                receive.
              </p>
            </Space>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NewsletterPromo;
