Feature: As a library member of staff I want to login so I can place a request
  # Note: users can currently login with either their Wellcome Trust account email address, library card number or library username

  Scenario: User supplies correct user name and password

    Given that I am on the login page
    When I enter my user name and password correctly and click ‘Login’
    Then I am taken to the xxxx page

  Scenario: User does NOT enter correct user name and password

    Given that I am on the login page
    When I enter my user name and password incorrectly and click ‘Login’
    Then I see an error message ‘incorrect username or password’


Feature: As a library member of staff I want to know if an item is available for requesting

  Scenario: A user searches for a work and it’s available to request

    Given that I have searched for an item
    When I click onto the work page I’m interested in
    Then I can see the work is available to request
    And I can see the location of the item
    And I can see a ‘request it’ button


  Scenario: A user searches for a work but it’s NOT available to request
    Given that I have searched for an item
    When I click on the work page I’m interested in
    Then I can see that the work isn’t available to request
    And I can see an error message “this item is not currently available to request”


Feature: As a library member of staff I need to know how many items I can request

  Scenario: A logged in user checks their account to see how many items they can request

    Given that I have logged in
    When I click on my account
    Then I can see a number indicating how many items I can request (20)


Feature: I need to know which part of an archive record I can request

  Scenario: A user has searched for a record from the Archives and Manuscripts collection and wants to see what they can request

    Given I have selected an archive/manuscript
    When I click to request it
    Then I need to see what parts of the archive record are available to request
    And how many parts I can request at any one time

Feature: As a library member of staff that is logged in, I want to place a request for one item

  Scenario: A logged in user searches for a work and places a request for one work/item

    Given that I am on a work page
    When I click the ‘Request It’ button
    Then I see a pop up modal that shows the item I am requesting
    And I can see how many requests I have left
    Then I can click a button to confirm my request
    And see a ‘request confirmed’ message


Feature: As a library member of staff that is logged in, I want to place a request for multiple items from one work

  Scenario: A logged in user places a request for multiple items within a work

    Given that I am on a work page that has multiple items
    When I have selected a number of those items to request
    And have clicked a ‘Request It’ button
    Then I see a pop up modal that shows an editable list of the items I’m requesting
    And how many requests I have left
    Then I can click a button to confirm my request
    And see a ‘request confirmed’ message


Feature: As a library member of staff that is logged in, I want to place a request at more than one time

  Scenario: A logged in user places a request for different items at several times during a day/week

    Given that I have requested an item previously
    When I want to select more items to request
    Then I want to see what items I’ve requested so far
    And how many more I can request before I hit the limit


Feature: As a library member of staff that is logged in, I want to place a request for multiple items at more than one time

  Scenario: A logged in user places a request for multiple items at several times during a day/week

    Given that I have already requested items previously
    When I want to select more items to request at a later time
    Then I need to see if an item has already been requested
    And I need to see what I’ve requested so far
    And how many more I can request before I hit the limit

Feature: As a library member of staff, I want to view the requests I’ve made when I’ve placed them

  Scenario: A user can view the request(s) they’ve made as soon as they’ve placed them

    Given that I have just placed a number of requests,
    When I select to view my account
    Then I can click to see a list of the requests I’ve made
    And see how many requests I have left within my limit

Feature: As a library member of staff, I want to view a list of requests I’ve placed at a later time after I have placed them

  Scenario: A user views a list of their active requests under their account

    Given that I have placed a number of requests previously
    When I login I can click to view my account
    Then I can select to see a list of the requests I’ve made
    And see how many requests I have left within my limit

Feature: As a library member of staff, I want to view a list of requests I’ve placed and the status of each item

  Scenario: A user views a list of their active requests under their account to see when they’re ready to pick up

    Given that I have placed a number of requests previously
    When I login I can view my account
    Then I can select to see a list of the requests I’ve made
    And see when my active requests are ready to pick up
    And where I need to pick them up from


Feature: As a library member of staff with accessibility needs, I need to know about the building’s access information for when my requests are ready to see.

  Scenario: A user looks at the requested items under their account to find out when they’re ready to pick up,
  what the pick up location is and what the accessibility is like

    Given that I have placed a number of requests previously
    When I login I can view my account to see my active requests
    Then I can select to see a list of the requests I’ve made
    And see when my active requests are ready to pick up (the item status)
    And information on the locations where I need to pick them up from (via on-page link to building access info / floorplan map)


