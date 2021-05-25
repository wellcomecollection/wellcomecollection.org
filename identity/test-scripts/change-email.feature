Feature: Change Email Address
  As a logged in user, I can manage my account details online, so I have control over my data.
  (https://digirati.atlassian.net/browse/WS-21)

  Background:
    Given a library user has logged in successfully and navigated to the My Account screen
    And the user selects the 'Change email' option from the ‘My Account’ screen

  @manual
  Scenario: WS-31-001: Change email address with invalid email address and correct password
    Given the user enters a invalid email address
    And the user enters a correct password to confirm
    When the user selects ‘update email’
    Then the user will be informed they must enter a valid email address

  @manual
  Scenario: WS-31-002: Change email address with an email address already in use and correct password
    Given the user enters a valid email address but it is already in use
    And the user enters a correct password to confirm
    When the user selects ‘update email
    Then the user will be informed the Email address is already in use

  @manual
  Scenario: WS-31-003: Change email address with new email not already in use and correct password
    Given the user enters a valid email address that is not already in use
    And the user enters a correct password to confirm
    When the user selects ‘update email’
    Then the user will be redirected to the My account page
    And the user will be informed by a message on the My Account page that ‘Email updated’
    And the new email address will appear on the My account page under ‘Email address’

  @manual
  Scenario: WS-31-004a: Change email with invalid email and incorrect password
    Given the user enters a invalid email address
    And the user enters a incorrect password to confirm
    When the user selects ‘update email’
    Then the user will be informed they must enter a valid email address

  @manual
  Scenario: WS-31-004b: Change email with correct credentials after previous incorrect attempt
    Given the user enters a invalid email address
    And the user enters a incorrect password to confirm
    When the user selects ‘update email’
    And the user enters a valid email address
    And the user selects ‘update email’
    Then the user will be informed that an error occurred

  @manual
  Scenario: WS-31-005: Change email with email in use and invalid password
    Given the user enters a valid email address but it is already in use
    And the user enters a invalid password to confirm
    When the user selects ‘update email’
    Then the user is informed by a message ‘incorrect password’,
    And the email address is reset to the original


  @manual
  Scenario: WS-31-006: Change email address with correct email but invalid password
    Given the user enters a valid email address that is not already in use
    And the user enters a incorrect password to confirm
    When the user selects ‘update email’
    Then the user is informed by a message ‘incorrect password’,
    And the email address is reset to the original

