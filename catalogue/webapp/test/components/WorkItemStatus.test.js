// @flow
import WorkItemStatus from '@weco/catalogue/components/WorkItemStatus/WorkItemStatus';
import { mountWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';
// import mockCatalogueWork from '@weco/catalogue/__mocks__/catalogue-work';
import mockStacksWork from '@weco/catalogue/__mocks__/stacks-work';

const availableItem = mockStacksWork.items.find(
  item => item.status.label === 'Available'
);
const temporarilyUnavailableItem = mockStacksWork.items.find(
  item => item.status.label === 'On holdshelf'
);
const unrequestableItem = mockStacksWork.items.find(
  item => item.status.label === 'Missing'
);

describe('Feature: 1. As a library member I want to know if an item is available for requesting', () => {
  test(`
    Scenario: I'm viewing a work page
      Given the work has a requestable item
      And it's available to request
      Then I can see that it's requestable
  `, () => {
    const wrapper = mountWithTheme(<WorkItemStatus item={availableItem} />);
    expect(wrapper.find('[data-test-id="itemStatus"]')).toMatchSnapshot();
  });

  test(`
    Scenario: I'm viewing a work page
      Given the work has a requestable item
      And it’s unavailable to request
      Then I can see a that it's temporarily unavailable
  `, () => {
    const wrapper = mountWithTheme(
      <WorkItemStatus item={temporarilyUnavailableItem} />
    );
    expect(wrapper.find('[data-test-id="itemStatus"]')).toMatchSnapshot();
  });

  test(`
    Scenario: I'm viewing a work page
      Given the work has no requestable items
      Then I can see a that it's not requestable and why (closed or open shelves or unknown)
  `, () => {
    const wrapper = mountWithTheme(<WorkItemStatus item={unrequestableItem} />);
    expect(wrapper.find('[data-test-id="itemStatus"]')).toMatchSnapshot();
  });
});
