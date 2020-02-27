// @flow
import WorkItemsStatus from '@weco/catalogue/components/WorkItemsStatus/WorkItemsStatus';
import { mountWithTheme, updateWrapperAsync } from '../fixtures/enzyme-helpers';
import mockWorkData from '@weco/catalogue/__mocks__/catalogue-work';
import mockStacksWorkData from '@weco/catalogue/__mocks__/stacks-work';
import 'next/router';
import getStacksWork from '@weco/catalogue/services/stacks/items';

jest.mock('next/router', () => ({
  query: {
    code: '',
  },
}));

function getMockStatus(statusKey) {
  return () =>
    new Promise((resolve, reject) => {
      resolve(mockStacksWorkData[statusKey]);
    });
}

jest.mock('@weco/catalogue/services/stacks/items', () => jest.fn());

describe('It renders the status of an item', () => {
  test('it is available', async () => {
    (getStacksWork: any).mockImplementation(getMockStatus('availableWork'));

    const component = mountWithTheme(<WorkItemsStatus work={mockWorkData} />);
    await updateWrapperAsync(component);

    expect(component.find("[data-test-id='itemStatus']").text()).toEqual(
      'Available'
    );
  });

  test('it is unavailable', async () => {
    (getStacksWork: any).mockImplementation(getMockStatus('unavailableWork'));

    const component = mountWithTheme(<WorkItemsStatus work={mockWorkData} />);
    await updateWrapperAsync(component);

    expect(component.find("[data-test-id='itemStatus']").text()).toEqual(
      'Unavailable'
    );
  });

  test('it is unrequestable', async () => {
    (getStacksWork: any).mockImplementation(getMockStatus('unrequestableWork'));

    const component = mountWithTheme(<WorkItemsStatus work={mockWorkData} />);
    await updateWrapperAsync(component);

    expect(component.find("[data-test-id='itemStatus']").text()).toEqual(
      'Unrequestable'
    );
  });
});
