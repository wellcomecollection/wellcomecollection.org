import { useEffect, FormEvent } from 'react';
import usePasswordRules from '../../src/frontend/hooks/usePasswordRules';
import { NextPage, GetServerSideProps } from 'next';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import NextLink from 'next/link';
import { AccountCreated } from '../../src/frontend/Registration/AccountCreated';
import { PageWrapper } from '../../src/frontend/components/PageWrapper';
import { useRouter } from 'next/router';
import {
  Cancel,
  Checkbox,
  ErrorAlert,
  ExternalLink,
  CheckboxLabel,
  InProgress,
} from '../../src/frontend/Registration/Registration.style';
import {
  Container,
  Title,
  Wrapper,
} from '../../src/frontend/components/Layout.style';
import WellcomeTextInput, {
  TextInputErrorMessage,
} from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import {
  useRegisterUser,
  RegistrationError,
} from '../../src/frontend/Registration/useRegisterUser';
import { usePageTitle } from '../../src/frontend/hooks/usePageTitle';
import {
  validEmailPattern,
  validPasswordPattern,
} from '../../src/frontend/components/ValidationPatterns';
import { PasswordRules } from '../../src/frontend/components/PasswordInput';
import { PasswordInput } from '../../src/frontend/Registration/PasswordInput';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { info2 } from '@weco/common/icons';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { ServerData } from '@weco/common/server-data/types';

const scrollToTop = () => window.scrollTo(0, 0);

type RegistrationInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  termsAndConditions: boolean;
};

const RegistrationPage: NextPage = () => {
  const router = useRouter();
  const { control, trigger, handleSubmit, formState, setError } =
    useForm<RegistrationInputs>({
      defaultValues: { password: '' },
    });
  const {
    registerUser,
    isLoading,
    isSuccess,
    error: registrationError,
  } = useRegisterUser();

  const passwordInputValue = useWatch({ control, name: 'password' }) as string;
  const passwordRules = usePasswordRules(passwordInputValue);

  usePageTitle('Register for a library account');

  useEffect(() => {
    scrollToTop();
    if (registrationError === RegistrationError.EMAIL_ALREADY_EXISTS) {
      setError('email', {
        type: 'manual',
        message: 'Email address already in use',
      });
    }
  }, [registrationError, setError]);

  if (isSuccess) {
    scrollToTop();
    return <AccountCreated />;
  }

  const createUser = (formData: RegistrationInputs) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { termsAndConditions, ...userDetails } = formData;
    registerUser(userDetails);
  };

  return (
    <PageWrapper title={`Registration`}>
      <Layout10>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <Title>Register for a library account</Title>
              {registrationError && (
                <>
                  <ErrorAlert aria-labelledby="error-text">
                    <Icon icon={info2} />
                    {registrationError ===
                      RegistrationError.EMAIL_ALREADY_EXISTS && (
                      <span id="error-text">
                        An account with this email address already exists,
                        please{' '}
                        <NextLink href="/account">
                          <a>sign in</a>
                        </NextLink>
                        .
                      </span>
                    )}
                    {registrationError ===
                      RegistrationError.PASSWORD_TOO_COMMON &&
                      'Password is too common'}
                    {registrationError === RegistrationError.UNKNOWN &&
                      'An unknown error occurred'}
                  </ErrorAlert>
                </>
              )}
              <p>
                An account lets you order items from the library&apos;s closed
                stores and access our online subscription collections.
              </p>
              <p>
                The first time you come to the library, you&apos;ll need to
                complete your <a href="">library membership</a>.
              </p>

              <form onSubmit={handleSubmit(createUser)} noValidate>
                <SpacingComponent>
                  <Controller
                    name="firstName"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Enter your first name' }}
                    render={({ onChange, value, name }, { invalid }) => (
                      <WellcomeTextInput
                        required
                        id={name}
                        label="First name"
                        value={value}
                        setValue={onChange}
                        isValid={!invalid}
                        setIsValid={() => trigger('firstName')}
                        showValidity={formState.isSubmitted}
                        errorMessage={formState.errors.firstName?.message}
                      />
                    )}
                  />
                </SpacingComponent>
                <SpacingComponent>
                  <Controller
                    name="lastName"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Enter your last name' }}
                    render={({ onChange, value, name }, { invalid }) => (
                      <WellcomeTextInput
                        required
                        id={name}
                        label="Last name"
                        value={value}
                        setValue={onChange}
                        isValid={!invalid}
                        setIsValid={() => trigger('lastName')}
                        showValidity={formState.isSubmitted}
                        errorMessage={formState.errors.lastName?.message}
                      />
                    )}
                  />
                </SpacingComponent>
                <SpacingComponent>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: 'Enter an email address',
                      pattern: {
                        value: validEmailPattern,
                        message: 'Enter a valid email address',
                      },
                    }}
                    render={({ onChange, value, name }, { invalid }) => (
                      <WellcomeTextInput
                        required
                        id={name}
                        label="Email address"
                        value={value}
                        setValue={onChange}
                        isValid={!invalid}
                        setIsValid={() => trigger('email')}
                        showValidity={formState.isSubmitted}
                        errorMessage={formState.errors.email?.message}
                      />
                    )}
                  />
                </SpacingComponent>
                <SpacingComponent>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: 'Enter a password',
                      pattern: {
                        value: validPasswordPattern,
                        message: 'Enter a valid password',
                      },
                    }}
                    render={({ onChange, value, name }, { invalid }) => (
                      <PasswordInput
                        required
                        id={name}
                        type="password"
                        label="Password"
                        value={value}
                        setValue={onChange}
                        isValid={!invalid}
                        setIsValid={() => trigger('password')}
                        showValidity={formState.isSubmitted}
                        errorMessage={formState.errors.password?.message}
                      />
                    )}
                  />
                  <Space v={{ size: 'm', properties: ['margin-top'] }}>
                    <PasswordRules {...passwordRules} />
                  </Space>
                </SpacingComponent>
                <SpacingComponent>
                  <Controller
                    name="termsAndConditions"
                    control={control}
                    defaultValue={false}
                    rules={{ required: 'Accept the terms to continue.' }}
                    render={({ value, onChange }) => (
                      <Checkbox
                        name={'termsAndConditions'}
                        id={'termsAndConditions'}
                        value={value}
                        onChange={(e: FormEvent<HTMLInputElement>) =>
                          onChange(e.currentTarget.checked)
                        }
                        checked={value}
                        text={
                          <CheckboxLabel>
                            I have read and agree to the{' '}
                            <ExternalLink
                              href="https://wellcome.org/about-us/governance/privacy-and-terms"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Privacy and Terms
                            </ExternalLink>{' '}
                            for Wellcome
                          </CheckboxLabel>
                        }
                      />
                    )}
                  />
                  <Space v={{ size: 's', properties: ['margin-top'] }}>
                    <ErrorMessage
                      errors={formState.errors}
                      name="termsAndConditions"
                      render={({ message }) => (
                        <TextInputErrorMessage>{message}</TextInputErrorMessage>
                      )}
                    />
                  </Space>
                </SpacingComponent>
                <SpacingComponent>
                  {isLoading ? (
                    <InProgress>Creating account…</InProgress>
                  ) : (
                    <ButtonSolid
                      type={ButtonTypes.submit}
                      text="Create account"
                    />
                  )}
                  <Space
                    as="span"
                    h={{ size: 'm', properties: ['margin-left'] }}
                  >
                    <Cancel onClick={router.back} />
                  </Space>
                </SpacingComponent>
              </form>
            </Wrapper>
          </Container>
        </Space>
      </Layout10>
    </PageWrapper>
  );
};

type Props = {
  serverData: ServerData;
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);

    return {
      props: removeUndefinedProps({
        serverData,
      }),
    };
  };

export default RegistrationPage;
