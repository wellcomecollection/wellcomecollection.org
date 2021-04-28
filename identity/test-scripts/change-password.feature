Feature: Change Password
  As a logged in user, I can manage my account details online, so I have control over my data.
  (https://digirati.atlassian.net/browse/WS-21)

  Background:
    Given a library user has logged in successfully and navigated to the My Account screen
    And the user clicks the 'Change password' option from the ‘My Account’ screen

  @manual
  Scenario: WS-31-007: Change password with correct field entries
    Given the user enters the correct current password
    And the user enters a valid new password
    And the user retypes the new password correctly
    When the user selects Update password
    Then the user is brought back to the ‘My account’ screen
    And a message is visible informing the user that the ‘Password updated’

  @manual
  Scenario: WS-31-008: Change password with incorrect current password
    Given the user enters the incorrect current password
    And the user enters a valid new password
    And the the user retypes the new password correctly
    When the user selects Update password
    Then the user is informed that Incorrect password on the Current password fields
    And the New password and Retype new password fields are reset

  @manual
  Scenario: WS-31-009a: Change password with invalid new password
    Given the user enters the correct current password
    When the user enters a invalid new password
    Then the user is informed ‘Enter a valid password’

  @manual
  Scenario: WS-31-009b: Change password with confirmed invalid new password
    Given the user enters the correct current password
    And the user enters a invalid new password
    When the user fills in the Retype new password
    And the user selects Update password
    Then the New Password field is highlighted and the message is still visible to the user ‘Enter a valid password’

  @manual
  Scenario: WS-31-010a: Change password with incorrect retype password
    Given the user enters the correct current password
    And the user enters a valid new password
    When the the user retypes the new password incorrectly
    Then the user is informed that ‘Passwords do not match’

  @manual
  Scenario: WS-31-010b: Submit change password form with incorrect retype password
    Given the user enters the correct current password
    And the user enters a valid new password
    When the the user retypes the new password incorrectly
    And the user selects Update password
    Then the screen remains open with the Retype new password field highlighted and message informing the user ‘Passwords do not match’

  @manual
  Scenario: WS-31-011: Change Password with no current password
    When the user does not populate the current password field
    Then the user is informed to ‘Enter your current password’

  @manual
  Scenario: WS-31-012a: Close change password modal
    Given the user populates all the fields correctly,
    When the user clicks the close on the box without updating the password
    Then the user is returned to the My Account Screen

  @manual
  Scenario: WS-31-012b: Password modal retains data
    Given the user populates all the fields correctly,
    When the user clicks the close on the box without updating the password
    And the user selects Change Password
    Then the Change Password Screen opens with the fields pre populated

  @manual
  Scenario: WS-31-012c: Change passwords correctly but do not update
    Given the user populates all the fields correctly
    And the user clicks the close on the box without updating the password
    And the user selects Change Password
    When the user selects Update Password without changing any fields
    Then the user is returned to the My Account Screen
