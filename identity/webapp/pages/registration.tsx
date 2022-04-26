import { FormEvent } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { withPageAuthRequiredSSR } from '../src/utility/auth0';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { PageWrapper } from '../src/frontend/components/PageWrapper';
import { font } from '@weco/common/utils/classnames';
import {
  Checkbox,
  ExternalLink,
  CheckboxLabel,
  FullWidthButton,
  FlexStartCheckbox,
} from '../src/frontend/Registration/Registration.style';
import { Container, Wrapper } from '../src/frontend/components/Layout.style';
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
import {
  Auth0UserProfile,
  auth0UserProfileToUserInfo,
} from '@weco/common/model/user';
import RegistrationInformation from '../src/frontend/Registration/RegistrationInformation';

type Props = {
  serverData: SimplifiedServerData;
  user?: Claims;
};

type RegistrationInputs = {
  firstName: string;
  lastName: string;
  termsAndConditions: boolean;
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

  const updateActionData = () => {
    // TODO: Use the action/method if client side validation passes
  };

  return (
    <PageWrapper title={`Registration`}>
      <Layout10>
        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <Container>
            <Wrapper>
              <Layout8>
                <Space v={{ size: 'xl', properties: ['padding-top'] }}>
                  <RegistrationInformation user={user} />

                  <form onSubmit={handleSubmit(updateActionData)} noValidate>
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
