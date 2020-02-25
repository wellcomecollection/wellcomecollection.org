// @flow
import WorkItemsStatus from '@weco/catalogue/components/WorkItemsStatus/WorkItemsStatus';
import { mountWithTheme, updateWrapperAsync } from '../fixtures/enzyme-helpers';
import mockWorkData from '@weco/catalogue/__mocks__/catalogue-work';
import mockStacksWorkData from '@weco/catalogue/__mocks__/stacks-work';
import React from 'react';

// TODO use shallow mount instead, so don't need to worry about useAuth in ItemRequestButton
import ItemRequestButton from '@weco/catalogue/components/ItemRequestButton/ItemRequestButton';
jest.mock('@weco/catalogue/components/ItemRequestButton/ItemRequestButton');
ItemRequestButton.prototype = React.Component.prototype;
ItemRequestButton.mockImplementation(() => {
  return {
    render: () => null,
  };
});

jest.mock('@weco/catalogue/services/stacks/items', () => ({
  __esModule: true,
  default: async () =>
    new Promise((resolve, reject) => {
      resolve(mockStacksWorkData.availableWork);
    }),
}));

// beforeEach(() => {
//   jest.resetModules();
// });

// beforeEach(() => {
//   jest.spyOn(React, 'useEffect').mockImplementation(f => f());
// });
// TODO Probably only need to check it renders the status
it('Renders the item status of an available work', async () => {
  const component = mountWithTheme(<WorkItemsStatus work={mockWorkData} />);
  await updateWrapperAsync(component);
  // expect(component.find("[data-test-id='itemStatus']").exists()).toBe(true);
  expect(component.find("[data-test-id='itemStatus']").text()).toEqual(
    'Available'
  );
});

it('Renders the item status of an unavailable work', async () => {
  const component = mountWithTheme(<WorkItemsStatus work={mockWorkData} />);
  await updateWrapperAsync(component);
  // expect(component.find("[data-test-id='itemStatus']").exists()).toBe(true);
  expect(component.find("[data-test-id='itemStatus']").text()).toEqual(
    'Unavailable'
  );
});

it('Renders the item status of an unrequestable work', async () => {
  const component = mountWithTheme(<WorkItemsStatus work={mockWorkData} />);
  await updateWrapperAsync(component);
  // expect(component.find("[data-test-id='itemStatus']").exists()).toBe(true);
  expect(component.find("[data-test-id='itemStatus']").text()).toEqual(
    'Unrequestable'
  );
});
