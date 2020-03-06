// @flow

import {
  mountWithTheme,
  updateWrapperAsync,
} from '@weco/common/test/fixtures/enzyme-helpers';
import WorkDetails from '@weco/catalogue/components/WorkDetails/WorkDetails';
import useAuth from '@weco/common/hooks/useAuth';
import mockAuthStates from '@weco/catalogue/__mocks__/auth-states';
import catalogueWork from '@weco/catalogue/__mocks__/catalogue-work';
import mockStacksWork from '@weco/catalogue/__mocks__/stacks-work';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';

const requestableCatalogueWork = catalogueWork;
requestableCatalogueWork.items[0].requestable = true;

jest.mock('@weco/catalogue/services/stacks/items', () => {
  return {
    __esModule: true,
    default: () => new Promise(resolve => resolve(mockStacksWork)),
  };
});

jest.mock('next/router', () => ({
  query: {
    code: '',
  },
}));

jest.mock('next/link', () => ({ children }) => children);

jest.mock('@weco/common/hooks/useAuth');

describe('Feature: 2. As a library member I want to request an item', () => {
  test(`
    Scenario: I'm logged out, viewing a work page
      Given the work has a requestable item
      And it’s available to request
      Then I can see a primary CTA to log in
    `, async () => {
    (useAuth: any).mockReturnValue(mockAuthStates.unauthorized);
    const wrapper = mountWithTheme(
      <TogglesContext.Provider value={{ stacksRequestService: true }}>
        <WorkDetails
          work={requestableCatalogueWork}
          iiifPresentationManifest={null}
          itemUrl={null}
          childManifestsCount={1}
          imageCount={1}
          showAvailableOnline={true}
        />
      </TogglesContext.Provider>
    );
    await updateWrapperAsync(wrapper);

    expect(wrapper.find("[data-test-id='libraryLoginCTA']")).toMatchSnapshot();
  });

  test(`Scenario: I'm logged out, viewing a work page
      Given the work has a requestable item
      And it’s unavailable to request
      Then I can't see a primary CTA to log in`, async () => {
    (useAuth: any).mockReturnValue(mockAuthStates.unauthorized);
    const wrapper = mountWithTheme(
      <WorkDetails
        work={catalogueWork}
        iiifPresentationManifest={null}
        itemUrl={null}
        childManifestsCount={1}
        imageCount={1}
        showAvailableOnline={true}
      />
    );
    await updateWrapperAsync(wrapper);
    expect(wrapper.find("[data-test-id='libraryLoginCTA']")).toMatchSnapshot();
  });

  // we currently make no distinction between unrequestable and unavailable
  (test: any).todo(`Scenario: I'm logged out, viewing a work page
    Given the work has no requestable items
    Then I can't see a primary CTA to log in`);

  test(`Scenario: I'm logged in, viewing a work page
  Given the work has a requestable item
  And it’s available to request
  Then I can see a primary CTA to request it`, async () => {
    (useAuth: any).mockImplementation(() => {
      return mockAuthStates.authorized;
    });
    const wrapper = mountWithTheme(
      <TogglesContext.Provider value={{ stacksRequestService: true }}>
        <WorkDetails
          work={requestableCatalogueWork}
          iiifPresentationManifest={null}
          itemUrl={null}
          childManifestsCount={1}
          imageCount={1}
          showAvailableOnline={true}
        />
      </TogglesContext.Provider>
    );
    await updateWrapperAsync(wrapper);

    expect(wrapper.find("[data-test-id='requestModalCTA']")).toMatchSnapshot();
  });

  (test: any).todo(`Scenario: A work has a single requestable item
  Given that I am on a work page that has a single requestable item
  When a user clicks the primary CTA to request the item
  Then I receive feedback as to whether the request succeeded or failed
  And if successful, I can see information about where to pick up the item`);

  (test: any).todo(`Scenario: A work has multiple requestable items
  Given that I am on a work page that has multiple requestable items
  Then I am able to select which items I want to request
  And click the primary CTA to request the items
  Then I receive feedback as to which item request succeeded or failed
  And if successful, I can see information about where to pick up the items`);
});
