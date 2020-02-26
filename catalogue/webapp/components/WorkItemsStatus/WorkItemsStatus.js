// @flow
import { useEffect, useState, Fragment } from 'react';
import { type Work } from '@weco/common/model/work';
import Space from '@weco/common/views/components/styled/Space';
import ItemRequestButton from '../ItemRequestButton/ItemRequestButton';
import getStacksWork from '@weco/catalogue/services/stacks/items';

type Props = {| work: Work |};

type StacksLocation = {| id: string, label: string |};
type StacksItemStatus = {| id: string, label: string |};
export type StacksItem = {|
  id: string,
  location: StacksLocation,
  status: StacksItemStatus,
|};
type PhysicalLocations = {|
  id: string,
  items: StacksItem[],
|};

const WorkItemsStatus = ({ work }: Props) => {
  const [
    physicalLocations,
    setPhysicalLocations,
  ] = useState<?PhysicalLocations>();

  useEffect(() => {
    let updateLocations = true;
    getStacksWork({ workId: work.id })
      .then(locations => {
        if (updateLocations) {
          setPhysicalLocations(locations);
        }
      })
      .catch(console.error);
    return () => {
      updateLocations = false;
    };
  }, []);

  return (
    <>
      <span>{physicalLocations && physicalLocations.id}</span>
      {physicalLocations &&
        physicalLocations.items.map(item => (
          <Fragment key={item.id}>
            <Space
              v={{
                size: 'l',
                properties: ['margin-bottom'],
              }}
            >
              <p className="no-margin">
                {/* {item.location.label}:{' '} TODO this is no longer in the stacks API - get from catalogueAPI */}
                <span data-test-id="itemStatus">{item.status.label}</span>
              </p>
              <Space
                v={{
                  size: 's',
                  properties: ['margin-top'],
                }}
              >
                <ItemRequestButton item={item} workId={work.id} />
              </Space>
            </Space>
          </Fragment>
        ))}
    </>
  );
};

export default WorkItemsStatus;
// TODO rename component ?
