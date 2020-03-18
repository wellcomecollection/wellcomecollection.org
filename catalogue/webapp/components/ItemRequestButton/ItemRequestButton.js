// @flow
import { type PhysicalItemAugmented } from '@weco/common/utils/works';
import Button from '@weco/common/views/components/Buttons/Button/Button';
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
    <Button
      type="primary"
      text="Request to view in library"
      clickHandler={event => {
        event.preventDefault();
        makeRequests(itemsWithPhysicalLocations);
      }}
    />
  ) : null;
};

export default ItemRequestButton;
