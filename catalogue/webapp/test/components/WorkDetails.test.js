describe('Feature: 2. As a library member I want to request an item', () => {
  test.todo(`Scenario: I'm logged out, viewing a work page
  Given the work has a requestable item
  And it’s available to request
  Then I can see a primary CTA to log in`);

  test.todo(`Scenario: I'm logged out, viewing a work page
  Given the work has a requestable item
  And it’s unavailable to request
  Then I can't see a primary CTA to log in`);

  test.todo(`Scenario: I'm logged out, viewing a work page
  Given the work has no requestable items
  Then I can't see a primary CTA to log in`);

  test.todo(`Scenario: I'm logged in, viewing a work page
  Given the work has a requestable item
  And it’s available to request
  Then I can see a primary CTA to request it`);

  test.todo(`Scenario: A work has a single requestable item
  Given that I am on a work page that has a single requestable item
  When a user clicks the primary CTA to request the item
  Then I receive feedback as to whether the request succeeded or failed
  And if successful, I can see information about where to pick up the item`);

  test.todo(`Scenario: A work has multiple requestable items
  Given that I am on a work page that has multiple requestable items
  Then I am able to select which items I want to request
  And click the primary CTA to request the items
  Then I receive feedback as to which item request succeeded or failed
  And if successful, I can see information about where to pick up the items`);
});
