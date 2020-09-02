// @flow
import { useState, useEffect, useRef } from 'react';
import { type Work } from '@weco/common/model/work';
import useAuth from '@weco/common/hooks/useAuth';
// $FlowFixMe (tsx)
import Table from '@weco/common/views/components/Table/Table';
// $FlowFixMe (tsx)
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import Modal from '@weco/common/views/components/Modal/Modal';
import ItemRequestButton from '@weco/catalogue/components/ItemRequestButton/ItemRequestButton';
// $FlowFixMe (tsx)
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import Space from '@weco/common/views/components/styled/Space';
import getStacksWork from '@weco/catalogue/services/stacks/items';
import {
  getItemsWithPhysicalLocation,
  type PhysicalItemAugmented,
} from '@weco/common/utils/works';
import { font, classNames } from '@weco/common/utils/classnames';
import LogInButton from '../LogInButton/LogInButton';
import { getUserHolds } from '../../services/stacks/requests';

type Props = {| work: Work |};
const RequestLocation = ({ work }: Props) => {
  const [hasRequestableItems, setHasRequestableItems] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const authState = useAuth();

  const [itemsWithPhysicalLocations, setItemsWithPhysicalLocations] = useState<
    PhysicalItemAugmented[]
  >(getItemsWithPhysicalLocation(work));
  const itemsRef = useRef(itemsWithPhysicalLocations);
  itemsRef.current = itemsWithPhysicalLocations;
  const singleItem = itemsWithPhysicalLocations.length === 1;

  useEffect(() => {
    if (authState.type === 'authorized') {
      getUserHolds({ token: authState.token.id_token })
        .then(userHolds => {
          const itemsOnHold = userHolds.results.map(hold => {
            return hold.item.id;
          });
          const newArray = itemsRef.current.map(item => {
            if (itemsOnHold.includes(item.id)) {
              return {
                ...item,
                requestable: false,
                requested: true,
              };
            } else {
              return {
                ...item,
                requested: false,
              };
            }
          });

          setItemsWithPhysicalLocations(newArray);
        })
        .catch(console.error);
    }
  }, [authState]);

  useEffect(() => {
    const fetchWork = async () => {
      const stacksWork = await getStacksWork({ workId: work.id });
      var merged = itemsRef.current.map(physicalItem => {
        const matchingItem = stacksWork.items.find(
          item => item.id === physicalItem.id
        );
        const physicalItemLocation = physicalItem.locations.find(
          location => location.type === 'PhysicalLocation'
        );
        const physicalItemLocationType =
          physicalItemLocation && physicalItemLocation.locationType;
        const physicalItemLocationLabel =
          physicalItemLocationType && physicalItemLocationType.label;
        const inClosedStores =
          physicalItemLocationLabel &&
          physicalItemLocationLabel.match(/[Cc]losed stores/);
        const requestable = Boolean(
          inClosedStores &&
            matchingItem &&
            matchingItem.status &&
            matchingItem.status.label === 'Available'
        );
        return {
          ...physicalItem,
          ...matchingItem,
          requestable: requestable,
          checked: !!(requestable && singleItem),
        };
      });
      setItemsWithPhysicalLocations(merged);
    };

    fetchWork();
  }, []);

  useEffect(() => {
    setHasRequestableItems(
      Boolean(itemsWithPhysicalLocations.find(item => item.requestable))
    );
  }, [itemsWithPhysicalLocations]);

  const headerRowDefault = ['Title', 'Location/Shelfmark', 'Status', 'Access'];
  const headerRowRequestable = ['', ...headerRowDefault];
  const headerRow = hasRequestableItems
    ? headerRowRequestable
    : headerRowDefault;
  const bodyRows = itemsWithPhysicalLocations.map(item => {
    return [
      hasRequestableItems && (
        <span hidden={singleItem}>
          {item.requestable && (
            <>
              <label className="visually-hidden">Request {item.id}</label>
              <CheckboxRadio
                id={item.id}
                type={`checkbox`}
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
        </span>
      ),
      item.title || 'unknown',
      (function() {
        const physicalLocation = item.locations.find(
          location => location.type === 'PhysicalLocation'
        );
        return physicalLocation ? physicalLocation.label : null;
      })(),
      item.requestSucceeded
        ? 'You have requested this item'
        : (item.requested && 'You have requested this item') ||
          (item.status && item.status.label) ||
          'Unknown',
      item.requestable ? 'Online request' : 'In library',
    ];
  });

  return (
    <>
      <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
        <Table rows={[headerRow, ...bodyRows]} caption={''} />
      </Space>

      {itemsWithPhysicalLocations.find(item => item.requestable) && (
        <>
          {authState.type === 'unauthorized' ? (
            <LogInButton workId={work.id} loginUrl={authState.loginUrl} />
          ) : (
            <>
              <div data-test-id="requestModalCTA">
                <ButtonSolid
                  text="Request"
                  clickHandler={() => {
                    if (itemsWithPhysicalLocations.find(item => item.checked)) {
                      setShowRequestModal(!showRequestModal);
                    } else {
                      window.alert('please make a selection');
                    }
                  }}
                  trackingEvent={{
                    category: 'Button',
                    action: 'open Stacks request modal window',
                    label: work.id,
                  }}
                />

                <Modal
                  isActive={showRequestModal}
                  setIsActive={setShowRequestModal}
                >
                  <h2
                    className={classNames({
                      [font('hnm', 5)]: true,
                    })}
                  >
                    Request items
                  </h2>
                  <p
                    className={classNames({
                      [font('hnl', 5)]: true,
                    })}
                  >
                    You are about to request the following items:
                  </p>
                  <p
                    className={classNames({
                      [font('hnm', 6)]: true,
                    })}
                  >
                    {work.title}
                  </p>
                  <ul className="plain-list no-padding">
                    {itemsWithPhysicalLocations.map(
                      item =>
                        item.requestable && (
                          <li
                            key={item.id}
                            className={classNames({
                              [font('hnm', 5)]: true,
                            })}
                          >
                            <Space
                              as="span"
                              className={classNames({
                                [font('hnl', 5)]: true,
                              })}
                              h={{
                                size: 's',
                                properties: ['margin-right'],
                              }}
                            >
                              <label className="visually-hidden">
                                Request {item.id}
                              </label>
                              <CheckboxRadio
                                id={item.id}
                                type={`checkbox`}
                                text=""
                                checked={item.checked}
                                name={item.id}
                                value={item.id}
                                onChange={() => {
                                  const newArray = itemsWithPhysicalLocations.map(
                                    i => {
                                      if (item.id === i.id) {
                                        return {
                                          ...i,
                                          checked: !i.checked,
                                        };
                                      } else {
                                        return i;
                                      }
                                    }
                                  );

                                  setItemsWithPhysicalLocations(newArray);
                                }}
                              />
                            </Space>
                            {item.title}
                            <Space
                              as="span"
                              className={classNames({
                                [font('hnl', 5)]: true,
                              })}
                              h={{
                                size: 'l',
                                properties: ['margin-left'],
                              }}
                            >
                              {(function() {
                                const physicalLocation = item.locations.find(
                                  location =>
                                    location.type === 'PhysicalLocation'
                                );
                                return physicalLocation
                                  ? physicalLocation.label
                                  : null;
                              })()}
                            </Space>
                          </li>
                        )
                    )}
                  </ul>
                  <div>
                    <ItemRequestButton
                      itemsWithPhysicalLocations={itemsWithPhysicalLocations}
                      setItemsWithPhysicalLocations={
                        setItemsWithPhysicalLocations
                      }
                      setShowRequestModal={setShowRequestModal}
                      setShowResultsModal={setShowResultsModal}
                    />
                    <button
                      className="plain-button"
                      onClick={() => {
                        setShowRequestModal(false);
                      }}
                    >
                      <Space
                        as="span"
                        className={classNames({
                          [font('hnl', 6)]: true,
                        })}
                        h={{ size: 'l', properties: ['margin-left'] }}
                      >
                        Cancel
                      </Space>
                    </button>
                  </div>
                </Modal>
              </div>
              {!showRequestModal && (
                <div data-test-id="resultsModalCTA">
                  <Modal
                    isActive={showResultsModal}
                    setIsActive={setShowResultsModal}
                  >
                    <h2
                      className={classNames({
                        [font('hnm', 5)]: true,
                      })}
                    >
                      {itemsWithPhysicalLocations.filter(item => item.requested)
                        .length ===
                      itemsWithPhysicalLocations.filter(
                        item => item.requestSucceeded
                      ).length
                        ? 'Your items have been requested'
                        : 'We were unable to request all of your items'}
                    </h2>
                    <ul className="plain-list no-padding">
                      {itemsWithPhysicalLocations
                        .filter(item => item.requested)
                        .map(item => (
                          <li key={item.id}>
                            <span
                              className={classNames({
                                [font('hnm', 5)]: true,
                              })}
                            >
                              {item.title}
                            </span>

                            <Space
                              as="span"
                              className={classNames({
                                [font('hnl', 5)]: true,
                              })}
                              h={{
                                size: 'l',
                                properties: ['margin-left'],
                              }}
                            >
                              {(function() {
                                const physicalLocation = item.locations.find(
                                  location =>
                                    location.type === 'PhysicalLocation'
                                );
                                return physicalLocation
                                  ? physicalLocation.label
                                  : null;
                              })()}
                              {` : ${
                                item.requestSucceeded
                                  ? 'item has been requested'
                                  : 'item request failed'
                              }`}
                            </Space>
                          </li>
                        ))}
                    </ul>
                    <ButtonSolid
                      text="Continue"
                      clickHandler={() => {
                        setShowResultsModal(false);
                      }}
                    />
                  </Modal>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default RequestLocation;
