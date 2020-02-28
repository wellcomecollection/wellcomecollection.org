// @flow
import WorkItemStatus from '@weco/catalogue/components/WorkItemStatus/WorkItemStatus';
import {
  mountWithTheme,
  updateWrapperAsync,
} from '@weco/common/test/fixtures/enzyme-helpers';
// import mockCatalogueWork from '@weco/catalogue/__mocks__/catalogue-work';
import mockStacksWork from '@weco/catalogue/__mocks__/stacks-work';

const availableItem = mockStacksWork.items.find(
  item => item.status.label === 'Available'
);

describe('Feature: 1. As a library member I want to know if an item is available for requesting', () => {
  test.only(`
    Scenario: I'm viewing a work page
      Given the work has a requestable item
      And it's available to request
      Then I can see that it's requestable
  `, async () => {
    const wrapper = mountWithTheme(<WorkItemStatus item={availableItem} />);
    await updateWrapperAsync(wrapper);
    expect(wrapper.find('[data-test-id="itemStatus"]')).toMatchSnapshot();
  });

  test.todo(`
    Scenario: I'm viewing a work page
      Given the work has a requestable item
      And it’s unavailable to request
      Then I can see a that it's temporarily unavailable
  `);

  test.todo(`
    Scenario: I'm viewing a work page
      Given the work has no requestable items
      Then I can see a that it's not requestable and why (closed or open shelves or unknown)
  `);
});
