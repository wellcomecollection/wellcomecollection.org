// @flow
import { useEffect, useState, Fragment } from 'react';
import Space from '@weco/common/views/components/styled/Space';
import ItemRequestButton from '../ItemRequestButton/ItemRequestButton';
import getStacksWork from '@weco/catalogue/services/stacks/items';

type Props = {| workId: string |};

type StacksItemStatus = {| id: string, label: string, type: 'ItemStatus' |};
export type StacksItem = {|
  id: string,
  dueDate: string,
  status: StacksItemStatus,
  type: 'item',
|};
type StacksWork = {|
  id: string,
  items: StacksItem[],
|};

const WorkItemsStatus = ({ workId }: Props) => {
  const [stacksWork, setStacksWork] = useState<?StacksWork>();

  useEffect(() => {
    let updateLocations = true;
    getStacksWork({ workId: workId })
      .then(work => {
        if (updateLocations) {
          setStacksWork(work);
        }
      })
      .catch(console.error);
    return () => {
      updateLocations = false;
    };
  }, []);

  return (
    <>
      <h2>
        <b>Items from Stacks works API</b>
      </h2>
      {stacksWork && JSON.stringify(stacksWork.items)}
      {stacksWork &&
        stacksWork.items.map(item => (
          <Fragment key={item.id}>
            <Space
              v={{
                size: 'l',
                properties: ['margin-bottom'],
              }}
            >
              <p className="no-margin">
                <span data-test-id="itemStatus">{item.status.label}</span>
              </p>
              <Space
                v={{
                  size: 's',
                  properties: ['margin-top'],
                }}
              >
                <ItemRequestButton item={item} workId={workId} />
              </Space>
            </Space>
          </Fragment>
        ))}
    </>
  );
};

export default WorkItemsStatus;
