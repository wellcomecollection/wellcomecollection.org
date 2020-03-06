// @flow
import { type PhysicalItemAugmented } from '@weco/common/utils/works';
import Button from '@weco/common/views/components/Buttons/Button/Button';
// import { requestItem } from '../../services/stacks/requests';
import useAuth from '@weco/common/hooks/useAuth';

type Props = {|
  itemsWithPhysicalLocations: PhysicalItemAugmented[],
  setItemsWithPhysicalLocations: (PhysicalItemAugmented[]) => void,
|};
const ItemRequestButton = ({
  itemsWithPhysicalLocations,
  setItemsWithPhysicalLocations,
}: Props) => {
  const authState = useAuth();

  async function makeRequest(items) {
    if (items.find(item => item.checked)) {
      if (authState.type === 'authorized') {
        const requestPromises = items
          .filter(item => item.checked)
          .map(item => {
            return (
              // TODO faking responses for development
              new Promise(
                resolve =>
                  resolve({
                    status: 202,
                  })
                // TODO handle reject
              )
                // return requestItem({ // TODO put back
                //   itemId: item.id,
                //   token: authState.token.id_token,
                // })
                .then(response => {
                  return {
                    id: item.id,
                    userHasRequested: response.status === 202,
                    requestable: !(response.status === 202),
                  };
                })
                .catch(err => console.log('error', err))
            );
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
        makeRequest(itemsWithPhysicalLocations);
      }}
    />
  ) : null;
};

export default ItemRequestButton;
