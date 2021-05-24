Feature: Request Delete
  As a logged in user, I can manage my account details online, so I have control over my data.
  (https://digirati.atlassian.net/browse/WS-21)

  Background:
    Given a library user has logged in successfully and navigated to the My Account screen
    And the user clicks the 'Request deletion' option from the ‘My Account’ screen

  @manual
  Scenario: WS-33-001: Cancel out of request to delete
    Given the User changes their mind and does not want to delete
    When the user click ‘No, take me back to my account’
    Then the request deletion modal is closed

  @manual
  Scenario: WS-33-002: Request delete but enter an invalid password
    Given the user has the 'Request deletion' screen open
    And the User enters an invalid password
    When the user click ‘Yes, delete my account’
    Then the user is informed 'Incorrect password.' and the field is highlighted

  @manual
  Scenario:WS-33-003: Request delete without filling in the password
    Given the User leaves the password field blank
    When the user click ‘Yes, delete my account’
    Then the user is informed ‘Enter your current password’ and the field is highlighted

  @manual
  Scenario: WS-33-004a: current password field is mandatory
    Given the User leaves the password field blank
    When the user click ‘Yes, delete my account’
    Then the user is informed ‘Enter your current password’ and the field is highlighted

  @manual
  Scenario: WS-33-004b: close the delete request modal
    Given the User leaves the password field blank
    When the user click ‘Yes, delete my account’
    Then the user is informed ‘Enter your current password’ and the field is highlighted
    And the user closes the box and does not select an action
    Then the user is returned to the My Account Screen

  @manual
  Scenario: WS-33-004c: close out of the delete request retains the status of the request upon closing
    Given the User leaves the password field blank
    When the user click ‘Yes, delete my account’
    Then the user is informed ‘Enter your current password’ and the field is highlighted
    And the user closes the box and does not select an action
    And the user selects ‘Request deletion’
    Then the delete screen modal opens with no previous error message displaying and password field empty 

  @manual
  Scenario:WS-33-005: Request delete with correct password and action
    Given the User enters an valid password
    When the user click ‘Yes, delete my account’
    Then.....

