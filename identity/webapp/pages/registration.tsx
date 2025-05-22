import { ErrorMessage } from '@hookform/error-message';
import { JwtPayload } from 'jsonwebtoken';
import { GetServerSideProps, NextPage } from 'next';
import getConfig from 'next/config';
import { FormEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { font } from '@weco/common/utils/classnames';
import { serialiseProps } from '@weco/common/utils/json';
import { isString } from '@weco/common/utils/type-guards';
import Button, { ButtonTypes } from '@weco/common/views/components/Buttons';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio';
import {
  ContaineredLayout,
  gridSize10,
  gridSize8,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import TextInput, {
  InputErrorMessage,
} from '@weco/common/views/components/TextInput';
import PageWrapper from '@weco/identity/components/PageWrapper';
import { RegistrationInformation } from '@weco/identity/components/Registration';
import {
  CheckboxLabel,
  FlexStartCheckbox,
  FullWidthButton,
} from '@weco/identity/components/Registration/Registration.styles';
import { Container, Wrapper } from '@weco/identity/components/styled/layouts';
import { usePageTitle } from '@weco/identity/hooks/usePageTitle';
import {
  collectionsResearchAgreementLabel,
  collectionsResearchAgreementTitle,
} from '@weco/identity/utils/copy';
import {
  decodeToken,
  RegistrationInputs,
} from '@weco/identity/utils/jwt-codec';

const { serverRuntimeConfig: config } = getConfig();

type Props = {
  serverData: SimplifiedServerData;
  sessionToken: string;
  auth0State: string;
  email: string;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  const serverData = await getServerData(context);
  const auth0State = isString(context.query.state)
    ? context.query.state
    : context.query.state?.join('');

  const sessionToken = isString(context.query.session_token)
    ? context.query.session_token
    : context.query.session_token?.join('');

  if (!sessionToken || !auth0State) {
    return appError(context, 500, 'Error connecting to auth');
  }

  let token: string | JwtPayload = '';
  let email = '';

  // We can get an error here if somebody tries to use an invalid session token;
  // which we return as a user error.
  try {
    token = decodeToken(sessionToken, config.auth0.actionSecret);
  } catch (error) {
    // There are non-nefarious reasons this might happen (eg expiry), so we redirect
    // to login as logging in will give the user a new token.
    console.error('Error decoding/validating session token', error);
    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
      },
    };
  }

  if (typeof token !== 'string') {
    email = token.email;
  }

  return {
    props: serialiseProps({
      serverData,
      sessionToken,
      auth0State,
      email,
    }),
  };
};

const RegistrationPage: NextPage<Props> = ({
  sessionToken,
  auth0State,
  email,
}) => {
  const { control, trigger, handleSubmit, formState } =
    useForm<RegistrationInputs>();

  usePageTitle('Register for a library account');

  // Use the user from the context provider as first preference, as it will
  // change without a page reload being required

  const updateActionData = (_, event: FormEvent<HTMLFormElement>) => {
    (event.target as HTMLFormElement).submit(); // Use the action/method if client side validation passes
  };

  return (
    <PageWrapper title="Registration">
      <ContaineredLayout gridSizes={gridSize10()}>
        <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <ContaineredLayout gridSizes={gridSize8()}>
                <Space $v={{ size: 'xl', properties: ['padding-top'] }}>
                  <RegistrationInformation email={email} />

                  <form
                    action="/account/api/registration"
                    method="POST"
                    onSubmit={handleSubmit(updateActionData)}
                    noValidate
                  >
                    <input
                      type="hidden"
                      name="sessionToken"
                      value={sessionToken}
                    />
                    <input type="hidden" name="state" value={auth0State} />
                    <SpacingComponent>
                      <Controller
                        name="firstName"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Enter your first name' }}
                        render={({
                          field: { onChange, value, name },
                          fieldState: { invalid },
                          formState,
                        }) => (
                          <TextInput
                            required
                            id={name}
                            name={name}
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
                        render={({
                          field: { onChange, value, name },
                          fieldState: { invalid },
                          formState,
                        }) => (
                          <TextInput
                            required
                            id={name}
                            name={name}
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
                      <h3 className={font('intb', 5)}>
                        {collectionsResearchAgreementTitle}
                      </h3>
                      <Controller
                        name="termsAndConditions"
                        control={control}
                        defaultValue={false}
                        rules={{ required: 'Accept the terms to continue.' }}
                        render={({ field: { value, onChange } }) => (
                          <FlexStartCheckbox>
                            <CheckboxRadio
                              name="termsAndConditions"
                              id="termsAndConditions"
                              type="checkbox"
                              value={String(value)}
                              onChange={(e: FormEvent<HTMLInputElement>) =>
                                onChange(e.currentTarget.checked)
                              }
                              hasErrorBorder={
                                !!formState.errors.termsAndConditions
                              }
                              checked={value}
                              text={
                                <CheckboxLabel>
                                  {collectionsResearchAgreementLabel}
                                </CheckboxLabel>
                              }
                            />
                          </FlexStartCheckbox>
                        )}
                      />
                      <Space $v={{ size: 's', properties: ['margin-top'] }}>
                        <ErrorMessage
                          errors={formState.errors}
                          name="termsAndConditions"
                          render={({ message }) => (
                            <InputErrorMessage errorMessage={message} />
                          )}
                        />
                      </Space>
                    </SpacingComponent>
                    <SpacingComponent>
                      <FullWidthButton>
                        <Button
                          variant="ButtonSolid"
                          dataGtmTrigger="create_library_account"
                          type={ButtonTypes.submit}
                          text="Create library account"
                        />
                      </FullWidthButton>
                    </SpacingComponent>
                  </form>
                </Space>
              </ContaineredLayout>
            </Wrapper>
          </Container>
        </Space>
      </ContaineredLayout>
    </PageWrapper>
  );
};

export default RegistrationPage;
