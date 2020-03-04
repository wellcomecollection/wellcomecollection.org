// @flow
import {
  mountWithTheme,
  updateWrapperAsync,
} from '@weco/common/test/fixtures/enzyme-helpers';
import WorkDetails from '@weco/catalogue/components/WorkDetails/WorkDetails';
import useAuth from '@weco/common/hooks/useAuth';
import { getUserHolds } from '@weco/catalogue/services/stacks/requests';
import mockAuthStates from '@weco/catalogue/__mocks__/auth-states';
import mockWork from '@weco/catalogue/__mocks__/stacks-work';
import mockRequests from '@weco/catalogue/__mocks__/stacks-requests';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import 'next/router';

jest.mock('next/router', () => ({
  query: {
    code: '',
  },
}));
// const availableItem = mockWork.items.find(
//   item => item.status.label === 'Available'
// );
// const unavailableItem = mockWork.items.find(
//   item => item.status.label !== 'Available'
// );
// const unrequestableItem = mockWork.items.find(
//   item => item.status.label === 'Missing'
// );

// jest.mock('@weco/catalogue/services/stacks/requests', () => ({
//   getUserHolds: jest.fn(),
// }));
jest.mock('@weco/common/hooks/useAuth');

describe('Feature: 2. As a library member I want to request an item', () => {
  // (getUserHolds: any).mockResolvedValue(mockRequests);
  test.only(`
    Scenario: I'm logged out, viewing a work page
      Given the work has a requestable item
      And it’s available to request
      Then I can see a primary CTA to log in
    `, async () => {
    (useAuth: any).mockImplementation(() => mockAuthStates.unauthorized);
    const component = mountWithTheme(
      <TogglesContext.Provider value={{ stacksRequestService: true }}>
        <WorkDetails
          work={mockWork}
          iiifPresentationManifest={null}
          itemUrl={null}
          childManifestsCount={1}
          imageCount={1}
          showAvailableOnline={true}
        />
      </TogglesContext.Provider>
    );
    await updateWrapperAsync(component);

    expect(
      component.find("[data-test-id='libraryLoginCTA']")
    ).toMatchSnapshot();
  });

  // test(`Scenario: I'm logged out, viewing a work page
  //     Given the work has a requestable item
  //     And it’s unavailable to request
  //     Then I can't see a primary CTA to log in`, async () => {
  //   (useAuth: any).mockReturnValue(mockAuthStates.unauthorized);
  //   const component = mountWithTheme(
  //     <ItemRequestButton item={unavailableItem} workId={'123'} />
  //   );
  //   await updateWrapperAsync(component);
  //   expect(component.find("[data-test-id='libraryLoginCTA']").exists()).toBe(
  //     false
  //   );
  // });

  // // we currently make no distinction between unrequestable and unavailable
  // test.skip(`Scenario: I'm logged out, viewing a work page
  //   Given the work has no requestable items
  //   Then I can't see a primary CTA to log in`, async () => {
  //   (useAuth: any).mockReturnValue(mockAuthStates.unauthorized);
  //   const component = mountWithTheme(
  //     <ItemRequestButton item={unrequestableItem} workId={'123'} />
  //   );
  //   await updateWrapperAsync(component);
  //   expect(component.find("[data-test-id='libraryLoginCTA']").exists()).toBe(
  //     false
  //   );
  // });

  // test(`Scenario: I'm logged in, viewing a work page
  // Given the work has a requestable item
  // And it’s available to request
  // Then I can see a primary CTA to request it`, async () => {
  //   (useAuth: any).mockImplementation(() => {
  //     return mockAuthStates.authorized;
  //   });
  //   const component = mountWithTheme(
  //     <ItemRequestButton item={availableItem} workId={'123'} />
  //   );
  //   await updateWrapperAsync(component);
  //   expect(component.find("[data-test-id='libraryRequestCTA']").exists()).toBe(
  //     true
  //   );
  //   expect(component.find("[data-test-id='libraryRequestCTA']").text()).toEqual(
  //     'Request to view in the library'
  //   );
  // });

  // (test: any).todo(`Scenario: A work has a single requestable item
  // Given that I am on a work page that has a single requestable item
  // When a user clicks the primary CTA to request the item
  // Then I receive feedback as to whether the request succeeded or failed
  // And if successful, I can see information about where to pick up the item`);

  // (test: any).todo(`Scenario: A work has multiple requestable items
  // Given that I am on a work page that has multiple requestable items
  // Then I am able to select which items I want to request
  // And click the primary CTA to request the items
  // Then I receive feedback as to which item request succeeded or failed
  // And if successful, I can see information about where to pick up the items`);
});
