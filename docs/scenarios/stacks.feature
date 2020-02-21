Feature: 1. As a library member I want to know if an item is available for requesting

  Scenario: I'm viewing a work page
    Given the work has a requestable item
    And it’s available to request
    Then I can see a that it's requestable

  Scenario: I'm viewing a work page
    Given the work has a requestable item
    And it’s unavailable to request
    Then I can see a that it's temporarily unavailable

  Scenario: I'm viewing a work page
    Given the work has no requestable items
    Then I can see a that it's not requestable and why (closed or open shelves or unknown)

Feature: 2. As a library member I want to request an item

  Scenario: I'm logged out, viewing a work page
    Given the work has a requestable item
    And it’s available to request
    Then I can see a primary CTA to log in

  Scenario: I'm logged out, viewing a work page
    Given the work has a requestable item
    And it’s unavailable to request
    Then I can't see a primary CTA to log in

  Scenario: I'm logged out, viewing a work page
    Given the work has no requestable items
    Then I can't see a primary CTA to log in

  Scenario: I'm logged in, viewing a work page
    Given the work has a requestable item
    And it’s available to request
    Then I can see a primary CTA to request it

  Scenario: A work has a single requestable item
    Given that I am on a work page that has a single requestable item
    When a user clicks the primary CTA to request the item
    Then I receive feedback as to whether the request succeeded or failed
    And if successful, I can see information about where to pick up the item

  Scenario: A work has multiple requestable items
    Given that I am on a work page that has multiple requestable items
    Then I am able to select which items I want to request
    And click the primary CTA to request the items
    Then I receive feedback as to which item request succeeded or failed
    And if successful, I can see information about where to pick up the items

Feature: 3. As a library member I need to know how many items I can request

  Scenario: I'm logged in and I check my account to see my requests
    Given I view my account
    Then I can see a number indicating how many items I can request (20)
    And how many active requests I have
    And how many requests I can still make

##Still to refine

Feature: As a library member, I want to view the requests I’ve made when I’ve placed them

  Scenario: I can see the request(s) I’ve made as soon as I’ve placed them

    Given that I have just placed a number of requests,
    When I select to view my account
    Then I can click to see a list of the requests I’ve made
    And see how many requests I have left within my limit


Feature: As a library member, I want to view a list of requests I’ve placed and the status of each item

  Scenario: I view a list of my active requests under my account to see when they’re ready to pick up

    Given that I have placed a number of requests previously
    When I login I can view my account
    Then I can select to see a list of the requests I’ve made
    And see when my active requests are ready to pick up
    And where I need to pick them up from

## For later

Feature: As a library member with accessibility needs, I need to know about the building’s access information for when my requests are ready to see.

  Scenario: I look at the requested items under my account to find out when they’re ready to pick up,
  what the pick up location is and what the accessibility is like

    Given that I have placed a number of requests previously
    When I login I can view my account to see my active requests
    Then I can select to see a list of the requests I’ve made
    And see when my active requests are ready to pick up (the item status)
    And information on the locations where I need to pick them up from (via on-page link to building access info / floorplan map)


Feature: As a library member I want to login so I can place a request
  # Note: users can currently login with either their Wellcome Trust account email address, library card number or library username

  Scenario: I enter correct user name and password information

    Given that I am on the login page
    When I enter my user name and password correctly and click ‘Login’
    Then I am taken to the xxxx page

  Scenario: I enter incorrect user name and password information

    Given that I am on the login page
    When I enter my user name and password incorrectly and click ‘Login’
    Then I see an error message ‘incorrect username or password’


Feature: As a library member I want to see a page containing information about a work I have searched for

  Scenario: I search for a work
    Given that I have searched for a work
    When I click onto the search result I’m interested in
    Then I can see the corresponding work page

Feature: I need to know which part of an archive record I can request

  Scenario: I've searched for a record from the Archives and Manuscripts collection and I want to see what I can request

    Given I have selected an archive/manuscript
    When I click to request it
    Then I need to see what parts of the archive record are available to request
    And how many parts I can request at any one time


  Scenario: I'm logged in, on a work page with a requestable and available item
    Given I have active requests for items
