# Manual test script: identity user flows

A manual regression script covering every user flow that touches identity and
auth. Run it after changes to the identity webapp's auth stack (eg SDK
upgrades, session changes) or to the Auth0 tenant — once after the stage
deployment and again after the production deployment. To track a run, copy
this file into a GitHub issue and tick scenarios off as you go.

## Environments

|                  | Stage                                                                | Production                                                        |
| ---------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Base URL         | <https://www-stage.wellcomecollection.org>                           | <https://wellcomecollection.org>                                  |
| Where email goes | The team **Mailtrap** account (stage sinks all outbound email there) | Real inboxes — sign up with an address whose inbox you can access |
| Sierra           | **Production** Sierra (stage is configured against it)               | Production Sierra                                                 |

Where a scenario says **the test inbox**, that means Mailtrap when testing
stage, and your real inbox when testing production.

The registration flow can't be fully tested on a local www-dev site: the
stage Auth0 tenant's post-signup Action always redirects to www-stage.

## Prerequisites

You will need:

- A fresh email address you can find in the test inbox (eg
  `yourname+test1@wellcomecollection.org`) for the account created in
  feature 1
- An existing **Reader** test account
- A **StaffWithRestricted** test account (feature 9 only)
- A work with requestable physical items, and a work with restricted items

Features 1–8 are ordered as a lifecycle: the account created in feature 1 is
used throughout and deleted in feature 8. **Both environments work against
production Sierra**, so registering creates a real patron record in the
production library system — always finish with feature 8 so the deletion
request is raised with the library team.

## 1. Joining the library

> As a _new researcher_
> I want to _join the library online_
> so that I can _request items and manage my membership_

### Scenario 1.1: starting signup

Given I am not signed in
When I follow a sign-up link (eg from the work page sign-in prompt)
Then I see the Auth0 account creation screen asking for email and password

### Scenario 1.2: password policy at signup

Given I am on the Auth0 account creation screen
When I enter a weak password (eg `password`)
Then the password is rejected with the policy requirements

### Scenario 1.3: registration form validation

Given I have created my login with a valid email and password
When I submit the registration form without a first name, without a last name, or without accepting the Collections Research Agreement
Then I see a validation message for the missing field and the form is not submitted

### Scenario 1.4: completing registration

Given I have filled in my first name, last name and accepted the agreement
When I submit the registration form
Then I am signed out and land on the application-received page showing the email address I signed up with

### Scenario 1.5: verification email

Given I have completed the registration form
When I check the test inbox
Then I see a verification email addressed to my signup email

### Scenario 1.6: verifying my email

Given I have received the verification email
When I follow its verification link
Then I see the email-verified page with new-member messaging (15-item request limit, visiting in person for full membership)

### Scenario 1.7: first sign-in after registration

Given I have verified my email
When I sign in with my new credentials
Then my account page shows the first and last name I registered with, never a placeholder name

## 2. Signing in

> As a _library member_
> I want to _sign in from wherever I am on the site_
> so that I can _carry on with what I was doing_

### Scenario 2.1: signing in from the header

Given I am signed out, on any page, in a desktop-sized window
When I open the header account menu, choose Sign in, and enter valid credentials
Then I am returned to my account page
And the header shows my name instead of Sign in

### Scenario 2.2: signing in on mobile

Given I am signed out, in a mobile-sized window
When I sign in from the header menu
Then I am returned to the site signed in, and the menu shows my name

### Scenario 2.3: returning to a work page after sign-in

Given I am signed out and viewing a work with requestable items
When I follow the "sign in to your library account" link and sign in
Then I am returned to the same work page, now signed in

### Scenario 2.4: visiting the account page signed out

Given I am signed out
When I visit `/account` directly
Then I am sent to the sign-in screen, and after signing in I land back on my account page

### Scenario 2.5: wrong credentials

Given I am on the Auth0 sign-in screen
When I enter an incorrect password
Then I see an error on the sign-in screen and can retry with the correct password

### Scenario 2.6: abandoning sign-in

Given I am partway through an Auth0 flow that returns an error (eg using an expired password-reset or verification link)
When I am returned to the site
Then I land on the account error page with a readable message, not a server error

### Scenario 2.7: signed-in state is consistent

Given I am signed in
When I browse between content pages and the account page, and refresh
Then every page agrees that I am signed in (header shows my name) without re-authenticating

## 3. Account page

> As a _library member_
> I want to _see my details and item requests_
> so that I can _check my membership is in order_

### Scenario 3.1: personal details

Given I am signed in on my account page
Then I see my name, email address and library card number

### Scenario 3.2: unverified email banner

Given my email address is not verified
When I view my account page
Then I see a banner asking me to verify my email
And when I choose "Send a new verification email" I see a confirmation message and a new email arrives in the test inbox

### Scenario 3.3: item requests section

Given I am signed in on my account page
Then I see either "Any item requests you make will appear here" (no requests) or a table of my requests with title, status, pickup date and location, and a count of how many of my 15 requests I have used

## 4. Changing my email address

> As a _library member_
> I want to _change my email address_
> so that I can _keep my contact details current_

### Scenario 4.1: changing email successfully

Given I am signed in on my account page
When I open Change email, enter a new address and my correct password, and submit
Then I see an "Email updated" message and the displayed email changes without reloading the page
And a verification email for the new address arrives in the test inbox, and the unverified banner shows until I verify it

### Scenario 4.2: wrong password

When I submit the change-email form with an incorrect password
Then I see "Incorrect password" and my email is unchanged

### Scenario 4.3: email already in use

When I submit an email address that belongs to another account
Then I see a message that the email address is already in use

### Scenario 4.4: client-side validation

When I enter an invalid email format, or my current email address
Then the form shows a validation message and does not submit

## 5. Changing my password

> As a _library member_
> I want to _change my password_
> so that I can _keep my account secure_

### Scenario 5.1: live password rules

Given I have the Change password form open
When I type a new password
Then the password requirements (at least 8 characters, lowercase, uppercase, number) tick off as each is met

### Scenario 5.2: changing password successfully

When I enter my current password and a valid new password twice, and submit
Then I see a "Password updated" message
And after signing out I can sign back in with the new password

### Scenario 5.3: wrong current password

When I submit the form with an incorrect current password
Then I see "Incorrect password" and my password is unchanged

### Scenario 5.4: repeating-pattern password

When I submit a new password with repeating patterns (eg `Abcabc123abcabc`)
Then I see a message that repeating characters won't be accepted

## 6. Requesting items

> As a _library member_
> I want to _request physical items_
> so that I can _view them in the library_

(See also [request-items.md](request-items.md) for the requesting user stories.)

### Scenario 6.1: requesting an item

Given I am signed in and viewing a work with requestable items
When I choose Request item, pick an available pickup date, and confirm
Then I see a confirmation naming the item
And my account page lists the new request and shows the incremented request count

## 7. Signing out

> As a _library member_
> I want to _sign out_
> so that _my account is not left open on a shared machine_

### Scenario 7.1: signing out from the header

Given I am signed in
When I choose Sign out from the header account menu
Then I am returned to the site signed out, the header shows Sign in again, and visiting `/account` sends me to the sign-in screen

## 8. Cancelling my membership

> As a _library member_
> I want to _delete my account_
> so that _the library no longer holds my details_

Run this last: it raises the deletion request for the account created in
feature 1. This matters — stage works against production Sierra, so the test
account is a real patron record until the library team actions the deletion.

### Scenario 8.1: backing out

Given I have opened Cancel your membership on my account page
When I choose "No, go back to my account"
Then the dialog closes and nothing changes

### Scenario 8.2: wrong password

When I confirm the deletion with an incorrect password
Then I see "Incorrect password" and my account is untouched

### Scenario 8.3: requesting deletion

When I confirm the deletion with my correct password
Then I am signed out and land on the delete-request-received page
And a confirmation email arrives in the test inbox

## 9. Restricted access

> As a _staff member with restricted access_
> I want to _view restricted items online_
> so that I can _do my job without requesting physical access_

These scenarios check that the patron role carries through the session
correctly. Allow popups for the site before starting — the restricted-access
sign-in opens in a popup (see
[the restricted access flow](../../docs/restricted-access-authentication-flow.md)).

### Scenario 9.1: staff member views restricted items

Given I am signed in as a StaffWithRestricted user
When I view the images of a work with restricted items
Then the restricted-access popup completes (or closes immediately if already authorised)
And the restricted images render in the viewer

### Scenario 9.2: ordinary member cannot view restricted items

Given I am signed in as a Reader
When I view the same work
Then I see the restricted-material treatment and cannot view the restricted images
