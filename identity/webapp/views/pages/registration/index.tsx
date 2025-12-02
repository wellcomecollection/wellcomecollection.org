import { ErrorMessage } from '@hookform/error-message';
import { NextPage } from 'next';
import { FormEvent, FunctionComponent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Button, { ButtonTypes } from '@weco/common/views/components/Buttons';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio';
import Divider from '@weco/common/views/components/Divider';
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
import { usePageTitle } from '@weco/identity/hooks/usePageTitle';
import { RegistrationInputs } from '@weco/identity/utils/jwt-codec';
import {
  Container,
  SectionHeading,
  Wrapper,
} from '@weco/identity/views/components/styled/Layouts';
import IdentityPageLayout from '@weco/identity/views/layouts/IdentityPageLayout';

export type Props = {
  sessionToken: string;
  auth0State: string;
  email: string;
};

const RegistrationInformation: FunctionComponent<{
  email: string;
}> = ({ email }) => {
  return (
    <>
      <SectionHeading as="h1">Apply for a library membership</SectionHeading>

      <h2 className={font('intb', 0)}>Your details</h2>
      <p style={{ marginBottom: 0 }}>
        Email address: <strong className={font('intb', -1)}>{email}</strong>
      </p>
      <Space $v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}>
        <Divider />
      </Space>
    </>
  );
};

const FullWidthButton = styled.div`
  * {
    width: 100%;
  }
`;

const FlexStartCheckbox = styled.div`
  label {
    align-items: flex-start;
  }
`;

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
    <IdentityPageLayout title="Registration">
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
                      <h3 className={font('intb', -1)}>
                        Collections research agreement
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
                                <div style={{ marginLeft: '0.333em' }}>
                                  <>
                                    I will use personal data on living persons
                                    for research purposes only. I will not use
                                    personal data to support decisions about the
                                    person who is the subject of the data, or in
                                    a way that causes substantial damage or
                                    distress to them. I have read and accept the
                                    regulations detailed in the{' '}
                                    <a
                                      href="https://wellcome.org/about-us/governance/privacy-and-terms"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ whiteSpace: 'nowrap' }}
                                    >
                                      Library’s Terms & Conditions of Use
                                    </a>
                                    .
                                  </>
                                </div>
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
                          dataGtmProps={{
                            trigger: 'create_library_account',
                          }}
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
    </IdentityPageLayout>
  );
};

export default RegistrationPage;
