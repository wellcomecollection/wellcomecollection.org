describe('Feature: 1. As a library member I want to know if an item is available for requesting', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    await page.goto('http://localhost:3001/works');
  });

  test(`
    Scenario: I'm viewing a work page
      Given the work has a requestable item
      And it's available to request
      Then I can see that it's requestable
  `, async () => {
    //
  });

  test(`
    Scenario: I'm viewing a work page
      Given the work has a requestable item
      And it’s unavailable to request
      Then I can see a that it's temporarily unavailable
  `, async () => {
    //
  });

  test(`
    Scenario: I'm viewing a work page
      Given the work has no requestable items
      Then I can see a that it's not requestable and why (closed or open shelves or unknown)
  `, async () => {
    //
  });
});
