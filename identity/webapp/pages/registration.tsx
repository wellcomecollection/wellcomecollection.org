import { FormEvent } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { withPageAuthRequiredSSR } from '../src/utility/auth0';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { PageWrapper } from '../src/frontend/components/PageWrapper';
import { font } from '@weco/common/utils/classnames';
import Divider from '@weco/common/views/components/Divider/Divider';
import {
  Checkbox,
  ExternalLink,
  CheckboxLabel,
  YellowBorder,
  FullWidthButton,
  FlexStartCheckbox,
} from '../src/frontend/Registration/Registration.style';
import {
  Container,
  Wrapper,
  SectionHeading,
} from '../src/frontend/components/Layout.style';
import WellcomeTextInput, {
  TextInputErrorMessage,
} from '@weco/common/views/components/TextInput/TextInput';
import { usePageTitle } from '../src/frontend/hooks/usePageTitle';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { useUser } from '@weco/common/views/components/UserProvider/UserProvider';
import { Claims } from '@auth0/nextjs-auth0';
import axios from 'axios';

import {
  Auth0UserProfile,
  auth0UserProfileToUserInfo,
} from '@weco/common/model/user';

type RegistrationInputs = {
  firstName: string;
  lastName: string;
  termsAndConditions: boolean;
};

type Props = {
  serverData: SimplifiedServerData;
  user?: Claims;
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  withPageAuthRequiredSSR({
    getServerSideProps: async context => {
      const serverData = await getServerData(context);

      if (!serverData.toggles.selfRegistration) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }

      return {
        props: removeUndefinedProps({
          serverData,
        }),
      };
    },
  });

const RegistrationPage: NextPage<Props> = ({ user: auth0UserClaims }) => {
  const { control, trigger, handleSubmit, formState } =
    useForm<RegistrationInputs>();

  usePageTitle('Register for a library account');
  const { user: contextUser } = useUser();

  // Use the user from the context provider as first preference, as it will
  // change without a page reload being required
  const user =
    contextUser ||
    auth0UserProfileToUserInfo(auth0UserClaims as Auth0UserProfile);

  const updateUser = async (formData: RegistrationInputs) => {
    await axios.put(`/account/api/users/${user.userId}`, formData);
  };

  return (
    <PageWrapper title={`Registration`}>
      <Layout10>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <Layout8>
                <Space v={{ size: 'xl', properties: ['padding-top'] }}>
                  <SectionHeading as="h1">
                    Apply for a library membership
                  </SectionHeading>
                  <div className="body-text">
                    <p>
                      With a library membership and online account, you’ll be
                      able to:
                      <ul>
                        <li>
                          Request up to 15 materials from our closed stores to
                          view in the library
                        </li>
                        <li>
                          Access subscription databases and other online
                          resources.
                        </li>
                      </ul>
                      When you complete your registration online, you’ll need to
                      email a form of personal identification (ID) and proof of
                      address to the Library team in order to confirm your
                      membership. Your membership will be confirmed within 72
                      hours.
                    </p>

                    <YellowBorder>
                      <p>
                        <strong>Note:</strong> You don’t need to apply for a
                        membership if you wish to view our digital collections
                        or visit the library for the day.
                      </p>
                    </YellowBorder>
                  </div>

                  <h2 className={font('hnb', 4)}>Your details</h2>
                  <p className="no-margin">
                    Email address:{' '}
                    <strong className={font('hnb', 5)}>{user.email}</strong>
                  </p>
                  <Space
                    v={{
                      size: 'm',
                      properties: ['margin-top', 'margin-bottom'],
                    }}
                  >
                    <Divider color={`pumice`} isKeyline />
                  </Space>

                  <form onSubmit={handleSubmit(updateUser)} noValidate>
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
                      <h3 className={font('hnb', 5)}>
                        Collections research agreement
                      </h3>
                      <Controller
                        name="termsAndConditions"
                        control={control}
                        defaultValue={false}
                        rules={{ required: 'Accept the terms to continue.' }}
                        render={({ value, onChange }) => (
                          <FlexStartCheckbox>
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
                                  I will use personal data on living persons for
                                  research purposes only. I will not use
                                  personal data to support decisions about the
                                  person who is the subject of the data, or in a
                                  way that causes substantial damage or distress
                                  to them. I have read and accept the
                                  regulations detailed in the{' '}
                                  <ExternalLink
                                    href="https://wellcome.org/about-us/governance/privacy-and-terms"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Library’s Terms & Conditions of Use
                                  </ExternalLink>
                                  .{' '}
                                </CheckboxLabel>
                              }
                            />
                          </FlexStartCheckbox>
                        )}
                      />
                      <Space v={{ size: 's', properties: ['margin-top'] }}>
                        <ErrorMessage
                          errors={formState.errors}
                          name="termsAndConditions"
                          render={({ message }) => (
                            <TextInputErrorMessage>
                              {message}
                            </TextInputErrorMessage>
                          )}
                        />
                      </Space>
                    </SpacingComponent>
                    <SpacingComponent>
                      <FullWidthButton>
                        <ButtonSolid
                          type={ButtonTypes.submit}
                          text="Create library account"
                        />
                      </FullWidthButton>
                    </SpacingComponent>
                  </form>
                </Space>
              </Layout8>
            </Wrapper>
          </Container>
        </Space>
      </Layout10>
    </PageWrapper>
  );
};

export default RegistrationPage;
