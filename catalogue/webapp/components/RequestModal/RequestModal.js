// @flow

import { useState } from 'react';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import Checkbox from '@weco/common/views/components/Checkbox/Checkbox';
import Modal from '@weco/common/views/components/Modal/Modal';
import { type PhysicalItemWithStatus } from '@weco/common/utils/works';
import { classNames, font } from '@weco/common/utils/classnames';
import ResponsiveTable from '@weco/common/views/components/styled/ResponsiveTable';
import ItemRequestButton from '@weco/catalogue/components/ItemRequestButton/ItemRequestButton';

type Props = {|
  itemsWithPhysicalLocations: PhysicalItemWithStatus[],
  setItemsWithPhysicalLocations: (items: PhysicalItemWithStatus[]) => void,
|};
const RequestModal = ({
  itemsWithPhysicalLocations,
  setItemsWithPhysicalLocations,
}: Props) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div data-test-id="requestModalCTA">
        <Button
          type="primary"
          text="Request"
          clickHandler={() => {
            setIsActive(!isActive);
          }}
        />
      </div>
      <Modal isActive={isActive} setIsActive={setIsActive}>
        <ResponsiveTable headings={['Location/Shelfmark', 'Status']}>
          <thead>
            <tr className={classNames({ [font('hnm', 5)]: true })}>
              <th></th>
              <th>Location/Shelfmark</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {itemsWithPhysicalLocations.map(item => (
              <tr
                key={item.id}
                className={classNames({ [font('hnm', 5)]: true })}
              >
                <td>
                  {item.status && item.status.label === 'Available' && (
                    <>
                      <label className="visually-hidden">
                        Request {item.id}
                      </label>
                      <Checkbox
                        id={item.id}
                        text=""
                        checked={item.checked}
                        name={item.id}
                        value={item.id}
                        onChange={() => {
                          const newArray = itemsWithPhysicalLocations.map(i => {
                            if (item.id === i.id) {
                              return { ...i, checked: !i.checked };
                            } else {
                              return i;
                            }
                          });

                          setItemsWithPhysicalLocations(newArray);
                        }}
                      />
                    </>
                  )}
                </td>
                <td>
                  <span className={classNames({ [font('hnl', 5)]: true })}>
                    {(function() {
                      const physicalLocation = item.locations.find(
                        location => location.type === 'PhysicalLocation'
                      );
                      return physicalLocation ? physicalLocation.label : null;
                    })()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </ResponsiveTable>
        <ItemRequestButton items={itemsWithPhysicalLocations} />
      </Modal>
    </>
  );
};

export default RequestModal;
