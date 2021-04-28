Feature: Profile

  @manual
  Scenario: Open profile page
    Given that I am on the home page of the admin app
    When I click on a user row
    Then the user's profile is opened
    And I can see the user's details
    And I can perform actions on the user

  @manual
  Scenario: Update profile details
    Given that I am on a user's profile
    When I enter a new first name
    And I enter a new surname
    And I enter a new email address
    And I submit the form
    Then I can see the updated user details

  @manual
  Scenario: Block user
    Given that I am on an unblocked user's profile
    When I click on the block account action
    Then I am told that the user has been blocked
    And the user is listed as blocked on the search page
    And the user is unable to sign in to the account management system

  @manual
  Scenario: Unblock user
    Given that I am on a blocked user's profile
    When I click on the unblock account action
    Then I am told that the user has been unblocked
    And the user is listed as unblocked on the search page
    And the user is able to sign in to the account management system

  @manual
  Scenario: Reset password
    Given that I am on a user's profile
    When I click on the reset email account action
    Then the user receives an email with a reset password link

  @manual
  Scenario: Unactivated user profile
    Given that I am on the profile of a user who has not verified their email address
    Then I am told that the user is waiting activation

  @manual
  Scenario: Resend activation email
    Given that I am on an unverified user's profile
    When I click on the resend activation email account action
    Then I am told that the activation email has been resent
    And the user receives a verification email

  @manual
  Scenario: User activation
    Given that I am on the home page of the admin app
    And an unverified user has received a verification email
    When the user clicks the verification link
    And I click into the user's profile
    Then I no longer see a notice informing me that the user is awaiting activation
    And the user receives a welcome email

  @manual
  Scenario: Undo delete request
    Given that I am on a pending delete user's profile
    When I click the reverse deletion request account action
    Then I am told that the deletion request has been reversed
    And the user is listed as active on the search page
    And the user is able to sign in to the account management system

  @manual
  Scenario: Delete requires confirmation
    Given that I am on a user's profile
    When I click the delete account action
    And I click cancel on the confirmation modal
    Then the user's account remains
    And the status is unchanged

  @manual
  Scenario: Delete account at user's request
    Given that I am on a pending delete user's profile
    When I click the delete account action
    And I click delete account on the confirmation modal
    Then I am redirected to the main page
    And I am told that the user's account has been deleted
    And I cannot see the account in the search results

  @manual
  Scenario: Delete account without user's request
    Given that I am on a user's profile
    When I click the delete account action
    And I click delete account on the confirmation modal
    Then I am redirected to the main page
    And I am told that the user's account has been deleted
    And I cannot see the account in the search results
