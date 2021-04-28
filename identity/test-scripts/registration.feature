Feature: User registration test scripts

  @manual
  Scenario: WS-28-001: As a user who wants to create a Wellcome Identity account,
    Given the user has navigated to the 'Register' form and has Javascript enabled in their browser
    Then the user will see the registration form presented

  @manual
  Scenario: WS-28-002: As a user who wants to create a Wellcome Identity account,
    Given the user has navigated to the 'Register' form and has Javascript disabled in their browser
    Then the user will be informed they must enable Javascript to complete the registration process

  @manual
  Scenario: WS-28-003: As a new user registering a new Wellcome Identity account using the 'Register' form,
    Given the user fails to provide a first name value,
    When the user clicks the 'Create Account' option
    Then the user will be informed they must provide a first name value

  @manual
  Scenario: WS-28-004: As a new user registering a new Wellcome Identity account using the 'Register' form,
    Given the user fails to provide a last name value,
    When the user clicks the 'Create Account' option
    Then the user will be informed they must provide a last name value

  @manual
  Scenario: WS-28-005: As a new user registering a new Wellcome Identity account using the 'Register' form,
    Given the user fails to provide a valid email address,
    When the user clicks the 'Create Account' option
    Then the user will be informed they must provide a valid email address

  @manual
  Scenario: WS-28-006: As a new user registering a new Wellcome Identity account using the 'Register' form,
    Given the user fails to provide a password value,
    When the user clicks the 'Create Account' option
    Then the user will be informed they must provide a valid password

  @manual
  Scenario: WS-28-007: As a new user registering a new Wellcome Identity account using the 'Register' form,
    Given the user provides an invalid password value,
    When the user clicks the 'Create Account' option
    Then the user will be informed they must provide a valid password

  @manual
  Scenario: WS-28-008: As a new user registering a new Wellcome Identity account using the 'Register' form,
    Given the user has entered a password value,
    When the user clicks to view their obfuscated password value
    Then the user will be able to see the value they have entered

  @manual
  Scenario: WS-28-009: As a new user registering a new Wellcome Identity account using the 'Register' form,
    Given the user fails to accept the Terms,
    When the user clicks the 'Create Account' option
    Then the user will be informed they must accept the terms to continue

  @manual
  Scenario: WS-28-010: As a new user registering a new Wellcome Identity account using the 'Register' form,
    Given the user wants to review the Privacy and Terms,
    When the user clicks the link to the Privacy and Terms option
    Then a new tab will open navigating the user to the correct Wellcome.org Privacy and Terms content

  @manual
  Scenario: WS-28-011: As a new user registering a new Wellcome Identity account,
    Given the user has decided not to proceed with the account creation,
    When the user clicks the link to the Cancel option
    Then the user is taken to the previous page mirroring the browser back option

  @manual
  Scenario: WS-28-012: As a new user registering a new Wellcome Identity account,
    Given the user has completed all of the necessary registration fields, but used an already registered email address
    When the user selects to Create account
    Then the user will receive an error message that indicates the email address is already in use
    And an information message that includes a link to the Sign In

  @manual
  Scenario: WS-28-013: As a new user registering a new Wellcome Identity account,
    Given the user has completed all of the necessary registration fields
    When the user selects to Create account
    Then the user will receive a success message that indicates the account has been created
    And an information message that indicates you must verify your email address to activate your account

  @manual
  Scenario: WS-28-014: As a new user registering a new Wellcome Identity account,
    Given the user has successfully created a new account
    Then the user will receive a 'Verify your email address' email to the registered email address

  @manual
  Scenario: WS-28-015: As a newly created user who has successfully registered a new Wellcome Identity account
    Given the user has received a 'Verify your email address' email to their registered email address
    When the user clicks the link to 'Verify my email address'
    Then the user will be navigated to a browser tab
    And presented with a 'Email verified' success message and a link to 'Continue to Sign in'

  @manual
  Scenario: WS-28-016: As a newly created user who has successfully registered a new Wellcome Identity account,
    Given the user has received a 'Verify your email address' email to their registered email address but has already clicked to 'Verify my email address' successfully
    When the user clicks the link to 'Verify my email address'
    Then the user will be navigated to a browser tab
    And presented with a 'Email verified' success message and a link to 'Continue to Sign in'

  @manual
  Scenario: WS-28-017: As a new user registering a new Wellcome Identity account,
    Given the user has completed all of the necessary registration fields
    When the user selects to Create account
    Then the user will see a loading state to indicate that their request is being processed
