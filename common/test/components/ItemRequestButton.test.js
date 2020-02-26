// @flow
import {
  mountWithTheme,
  updateWrapperAsync,
} from '@weco/common/test/fixtures/enzyme-helpers';
import ItemRequestButton from '@weco/catalogue/components/ItemRequestButton/ItemRequestButton';
import useAuth from '@weco/common/hooks/useAuth';
// import { getUserHolds } from '@weco/catalogue/services/stacks/requests';
import mockAuthStates from '@weco/catalogue/__mocks__/auth-states';
import mockWork from '@weco/catalogue/__mocks__/stacks-work';
// import mockRequests from '@weco/catalogue/__mocks__/stacks-requests';

const availableItem = mockWork.items.find(
  item => item.status.label === 'Available'
);
const unavailableItem = mockWork.items.find(
  item => item.status.label === 'On display'
);
const unrequestableItem = mockWork.items.find(
  item => item.status.label === 'Missing'
);

jest.mock('@weco/catalogue/services/stacks/requests');
jest.mock('@weco/common/hooks/useAuth');

// Feature: 2. As a library member I want to request an item

// Scenario: I'm logged out, viewing a work page
// Given the work has a requestable item
// And it’s available to request
// Then I can see a primary CTA to log in
describe('A logged out user, viewing a work with an available item, is presented with a log in CTA.', () => {
  (useAuth: any).mockReturnValue(mockAuthStates.unauthorized);
  it('renders the login button', async () => {
    const component = mountWithTheme(
      <ItemRequestButton item={availableItem} workId={'123'} />
    );
    await updateWrapperAsync(component);
    expect(component.find("[data-test-id='libraryLoginCTA']").exists()).toBe(
      true
    );
    expect(component.find("[data-test-id='libraryLoginCTA']").text()).toEqual(
      'Login to request and view in the library'
    );
  });
});

// Scenario: I'm logged out, viewing a work page
// Given the work has a requestable item
// And it’s unavailable to request
// Then I can't see a primary CTA to log in
describe('A logged out user, viewing a work with an unavailable item, is not presented with a log in CTA.', () => {
  (useAuth: any).mockReturnValue(mockAuthStates.unauthorized);
  it("doesn't render the login button", async () => {
    const component = mountWithTheme(
      <ItemRequestButton item={unavailableItem} workId={'123'} />
    );
    await updateWrapperAsync(component);
    expect(component.find("[data-test-id='libraryLoginCTA']").exists()).toBe(
      false
    );
  });
});

// Scenario: I'm logged out, viewing a work page
// Given the work has no requestable items
// Then I can't see a primary CTA to log in
describe('A logged out user, viewing a work with an unrequestable item, is not presented with a log in CTA.', () => {
  (useAuth: any).mockReturnValue(mockAuthStates.unauthorized);
  it("doesn't render the login button", async () => {
    const component = mountWithTheme(
      <ItemRequestButton item={unrequestableItem} workId={'123'} />
    );
    await updateWrapperAsync(component);
    expect(component.find("[data-test-id='libraryLoginCTA']").exists()).toBe(
      false
    );
  });
});

// Scenario: I'm logged in, viewing a work page
// Given the work has a requestable item
// And it’s available to request
// Then I can see a primary CTA to request it

// TODO - need to get this working with mocking getUserHolds
// describe('A logged in  user, viewing a work with an available item, is presented with a request CTA.', () => {
//   (useAuth: any).mockReturnValue(mockAuthStates.authorized);
//   (getUserHolds: any).mockReturnValue(Promise.resolve(mockRequests));
//   it('renders the request button', async () => {
//     const component = mountWithTheme(
//       <ItemRequestButton item={availableItem} workId={'123'} />
//     );
//     await updateWrapperAsync(component);
//     expect(component.find("[data-test-id='libraryRequestCTA']").exists()).toBe(
//       true
//     );
//     expect(component.find("[data-test-id='libraryRequestCTA']").text()).toEqual(
//       'Request to view in the library'
//     );
//   });
//   it("doesn't render the login button", async () => {
//     const component = mountWithTheme(
//       <ItemRequestButton item={availableItem} workId={'123'} />
//     );
//     await updateWrapperAsync(component);
//     expect(component.find("[data-test-id='libraryLoginCTA']").exists()).toBe(
//       false
//     );
//   });
// });
