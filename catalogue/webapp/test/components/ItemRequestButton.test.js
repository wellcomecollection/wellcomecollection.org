// @flow
import {
  mountWithTheme,
  updateWrapperAsync,
} from '@weco/common/test/fixtures/enzyme-helpers';
import ItemRequestButton from '@weco/catalogue/components/ItemRequestButton/ItemRequestButton';
import useAuth from '@weco/common/hooks/useAuth';
import { getUserHolds } from '@weco/catalogue/services/stacks/requests';
import mockAuthStates from '@weco/catalogue/__mocks__/auth-states';
import mockWork from '@weco/catalogue/__mocks__/stacks-work';
import mockRequests from '@weco/catalogue/__mocks__/stacks-requests';

const availableItem = mockWork.items.find(
  item => item.status.label === 'Available'
);
const unavailableItem = mockWork.items.find(
  item => item.status.label !== 'Available'
);
const unrequestableItem = mockWork.items.find(
  item => item.status.label === 'Missing'
);

jest.mock('@weco/catalogue/services/stacks/requests', () => ({
  getUserHolds: jest.fn(),
}));
jest.mock('@weco/common/hooks/useAuth');

describe('Feature: 2. As a library member I want to request an item', () => {
  (getUserHolds: any).mockResolvedValue(mockRequests);
  test(`Scenario: I'm logged out, viewing a work page
  Given the work has a requestable item
  And it’s available to request
  Then I can see a primary CTA to log in`, async () => {
    (useAuth: any).mockImplementation(() => {
      return mockAuthStates.unauthorized;
    });
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

  test(`Scenario: I'm logged out, viewing a work page
      Given the work has a requestable item
      And it’s unavailable to request
      Then I can't see a primary CTA to log in`, async () => {
    (useAuth: any).mockReturnValue(mockAuthStates.unauthorized);
    const component = mountWithTheme(
      <ItemRequestButton item={unavailableItem} workId={'123'} />
    );
    await updateWrapperAsync(component);
    expect(component.find("[data-test-id='libraryLoginCTA']").exists()).toBe(
      false
    );
  });

  // we currently make no distinction between unrequestable and unavailable
  test.skip(`Scenario: I'm logged out, viewing a work page
    Given the work has no requestable items
    Then I can't see a primary CTA to log in`, async () => {
    (useAuth: any).mockReturnValue(mockAuthStates.unauthorized);
    const component = mountWithTheme(
      <ItemRequestButton item={unrequestableItem} workId={'123'} />
    );
    await updateWrapperAsync(component);
    expect(component.find("[data-test-id='libraryLoginCTA']").exists()).toBe(
      false
    );
  });

  test.skip(`Scenario: I'm logged in, viewing a work page
  Given the work has a requestable item
  And it’s available to request
  Then I can see a primary CTA to request it`, async () => {
    (useAuth: any).mockImplementation(() => {
      return mockAuthStates.authorized;
    });
    const component = mountWithTheme(
      <ItemRequestButton item={availableItem} workId={'123'} />
    );
    await updateWrapperAsync(component);
    expect(component.find("[data-test-id='libraryRequestCTA']").exists()).toBe(
      true
    );
    expect(component.find("[data-test-id='libraryRequestCTA']").text()).toEqual(
      'Request to view in the library'
    );
  });

  test.skip("doesn't render the login button", async () => {
    const component = mountWithTheme(
      <ItemRequestButton item={availableItem} workId={'123'} />
    );
    await updateWrapperAsync(component);
    expect(component.find("[data-test-id='libraryLoginCTA']").exists()).toBe(
      false
    );
  });
});
