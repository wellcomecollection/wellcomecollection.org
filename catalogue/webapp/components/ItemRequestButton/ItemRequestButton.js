// @flow
import { type PhysicalItemAugmented } from '@weco/common/utils/works';
// $FlowFixMe (tsx)
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { requestItem } from '../../services/stacks/requests';
import useAuth from '@weco/common/hooks/useAuth';

type Props = {|
  itemsWithPhysicalLocations: PhysicalItemAugmented[],
  setItemsWithPhysicalLocations: (PhysicalItemAugmented[]) => void,
  setShowRequestModal: boolean => void,
  setShowResultsModal: boolean => void,
|};
const ItemRequestButton = ({
  itemsWithPhysicalLocations,
  setItemsWithPhysicalLocations,
  setShowRequestModal,
  setShowResultsModal,
}: Props) => {
  const authState = useAuth();

  async function makeRequests(items: PhysicalItemAugmented[]) {
    if (items.find(item => item.checked)) {
      if (authState.type === 'authorized') {
        const requestPromises = items
          .filter(item => item.checked)
          .map(item => {
            return requestItem({
              itemId: item.id,
              token: authState.token.id_token,
            })
              .then(response => {
                return {
                  id: item.id,
                  requested: true,
                  requestSucceeded: response === 202,
                };
              })
              .catch(err => console.log('error', err));
          });
        Promise.all(requestPromises).then(requests => {
          setItemsWithPhysicalLocations(
            itemsWithPhysicalLocations.map(item => {
              const matchingRequest = requests.find(
                request => request && request.id === item.id
              );
              if (matchingRequest) {
                return {
                  ...item,
                  ...matchingRequest,
                };
              } else {
                return item;
              }
            })
          );
          setShowRequestModal(false);
          setShowResultsModal(true);
        });
      }
    } else {
      window.alert('please make a selection');
    }
  }

  return authState.type === 'authorized' ? (
    <ButtonSolid
      text="Request to view in library"
      clickHandler={event => {
        event.preventDefault();
        makeRequests(itemsWithPhysicalLocations);
      }}
      trackingEvent={{
        category: 'Button',
        action: 'confirm Stacks request',
        label: `item id(s): ${itemsWithPhysicalLocations
          .map(i => i.id)
          .join()}`,
      }}
    />
  ) : null;
};

export default ItemRequestButton;
