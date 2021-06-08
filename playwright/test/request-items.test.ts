describe('Scenario 1: researcher is logged out', () => {
  test('Link to login/registration is displayed', () => {
    // Log out
    // Go to item page with requestable items
    // Expect link to login/registration page
  });
});

describe('Scenario 2: researcher is not a library member', () => {
  test('Information about registering for library membership is displayed', () => {
    // Log out
    // Go to login/register page
    // Expect information about joining library
    // Expect registration button
  });
});

describe('Scenario 3: researcher is a library member', () => {
  test('Researcher can log in', () => {
    // Log out
    // Go to Login/register page
    // Expect login form
    // Fill in username and password
    // Submit form
    // Expect to be logged in
  });
});

describe('Scenario 4: researcher is logged in', () => {
  test('Items display their requestability', () => {
    // Log in
    // Go to work page with requestable items
    // Expect request button for each requestable item
  });
});

describe('Scenario 5: researcher initiates item request', () => {
  beforeAll(() => {
    // Log in
    // Go to work page with requestable items
    // Click request button
  });

  test('Account indicates number of remaining requests', () => {
    // Expect x of y requests remaining
  });

  test('Researcher can cancel request', () => {
    // Click cancel request button
    // Expect item not to have been requested
    // Expect to see request button for item
  });
});

describe('Scenario 6: researcher confirms item request', () => {
  beforeAll(() => {
    // Log in
    // Go to work page with requestable items
    // Click request button
  });

  test('Researcher can confirm request', () => {
    // Expect
    // Click confirm button
    // Expect item to have been requested
    // Expect success message
    // Expect location/duration information
    // Expect process for collection information
    // Expect book a ticket button
  });
});
