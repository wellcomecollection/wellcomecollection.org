// @flow
// import WorkItemsStatus from '@weco/catalogue/components/WorkItemsStatus/WorkItemsStatus';
// import {
//   mountWithTheme,
//   updateWrapperAsync,
// } from '@weco/common/test/fixtures/enzyme-helpers';
// import mockCatalogueWork from '@weco/catalogue/__mocks__/catalogue-work';
import mockStacksWork from '@weco/catalogue/__mocks__/stacks-work';
import 'next/router';
import getStacksWork from '@weco/catalogue/services/stacks/items';

jest.mock('next/router', () => ({
  query: {
    code: '',
  },
}));

function getMockStatus(mockStacksWork, status) {
  return mockStacksWork.items.find(item => item.status.label === status);
}

jest.mock('@weco/catalogue/services/stacks/items', () => jest.fn());

describe('Feature: 1. As a library member I want to know if an item is available for requesting', () => {
  test(`
    Scenario: I'm viewing a work page
      Given the work has a requestable item
      And it's available to request
      Then I can see that it's requestable
  `, async () => {
    (getStacksWork: any).mockReturnValue(
      getMockStatus(mockStacksWork, 'availableWork')
    );
  });

  test(`
    Scenario: I'm viewing a work page
      Given the work has a requestable item
      And it’s unavailable to request
      Then I can see a that it's temporarily unavailable
  `, async () => {
    (getStacksWork: any).mockReturnValue(
      getMockStatus(mockStacksWork, 'unavailableWork')
    );
  });

  xtest(`
    Scenario: I'm viewing a work page
      Given the work has no requestable items
      Then I can see a that it's not requestable and why (closed or open shelves or unknown)
  `, async () => {
    (getStacksWork: any).mockReturnValue(
      getMockStatus(mockStacksWork, 'unrequestableWork')
    );
  });
});
