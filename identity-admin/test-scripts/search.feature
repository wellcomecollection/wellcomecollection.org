Feature: Search

  @manual
  Scenario: log in and see homepage
    Given I have logged in as an admin
    When I go to the home page
    Then I see a list of all users
    And the users are ordered by last login date
    And there are 25 users per page

  @manual
  Scenario: Search by name
    Given that I am on the home page of the admin app
    When I enter my name into the search field
    Then users with my name are shown

  @manual
  Scenario: Search by email
    Given that I am on the home page of the admin app
    When I enter my email address into the search field
    Then users with my email address are shown

  @manual
  Scenario: Filter by status=active
    Given that I am on the home page of the admin app
    When I filter by status active
    Then only active users are shown

  @manual
  Scenario: Filter by status=pending delete
    Given that I am on the home page of the admin app
    When I filter by status pending delete
    Then only pending delete users are shown

  @manual
  Scenario: Filter by status=blocked
    Given that I am on the home page of the admin app
    When I filter by status blocked
    Then blocked users are shown
    And pending delete users are shown

  @manual
  Scenario: Sort by patron record number ascending
    Given that I am on the home page of the admin app
    When I sort by patron record number
    Then the users are ordered by patron record number ascending
    And the patron record number sort arrow points downwards

  @manual
  Scenario: Sort by patron record number descending
    Given that I am on the home page of the admin app
    When I sort by patron record number
    And I sort by patron record number
    Then the users are ordered by patron record number descending
    And the patron record number sort arrow points upwards

  @manual
  Scenario: Sort by name ascending
    Given that I am on the home page of the admin app
    When I sort by name
    Then the users are ordered by name ascending
    And the name sort arrow points downwards

  @manual
  Scenario: Sort by name descending
    Given that I am on the home page of the admin app
    When I sort by name
    And I sort by name
    Then the users are ordered by name descending
    And the name sort arrow points upwards

  @manual
  Scenario: Sort by email ascending
    Given that I am on the home page of the admin app
    When I sort by email
    Then the users are ordered by email ascending
    And the email sort arrow points downwards

  @manual
  Scenario: Sort by email descending
    Given that I am on the home page of the admin app
    When I sort by email
    And I sort by email
    Then the users are ordered by email descending
    And the email sort arrow points upwards

  @manual
  Scenario: Sort by last login date ascending
    Given that I am on the home page of the admin app
    When I sort by last login date
    Then the users are ordered by last login date ascending
    And the last login date sort arrow points downwards

  @manual
  Scenario: Sort by last login date descending
    Given that I am on the home page of the admin app
    When I sort by last login date
    And I sort by last login date
    Then the users are ordered by last login date descending
    And the last login date sort arrow points upwards

  @manual
  Scenario: pagination
    Given that I am on the home page of the admin app
    And there are multiple pages of search results
    Then I should see which page I am on
    And I should be able to move to the next and previous pages
    And I should be able to move to the first and last pages
    And I should be able to move two pages either side of the current page
