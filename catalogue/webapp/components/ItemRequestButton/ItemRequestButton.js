// @flow
import merge from 'lodash.merge';
import { Tag } from '@weco/common/views/components/Tags/Tags';
import { classNames, font } from '@weco/common/utils/classnames';
import { type PhysicalItemAugmented } from '@weco/common/utils/works';

// import { requestItem } from '../../services/stacks/requests';
import useAuth from '@weco/common/hooks/useAuth';

type Props = {|
  items: PhysicalItemAugmented[],
  setItemsWithPhysicalLocations: (PhysicalItemAugmented[]) => void,
|};
const ItemRequestButton = ({ items, setItemsWithPhysicalLocations }: Props) => {
  const authState = useAuth();

  async function makeRequest(items) {
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
                // setRequestedState('requested')
                console.log(response.status);
                return {
                  id: item.id,
                  userHasRequested: response.status === 202,
                };
              })
              .catch(err => console.log('error', err))
          );
        });
      const allResolvedRequests = await Promise.all(requestPromises);
      setItemsWithPhysicalLocations(merge(items, allResolvedRequests));
    }
  }

  return (
    <Tag
      className={classNames({
        'line-height-1': true,
        'inline-block bg-green font-white': true,
        'bg-hover-black': true,
        'border-color-green border-width-1': true,
      })}
    >
      <div className={`${font('hnm', 5)}`}>
        {authState.type === 'authorized' && (
          <a
            data-test-id="libraryRequestCTA"
            href={'#'}
            onClick={event => {
              event.preventDefault();
              makeRequest(items);
            }}
          >
            Request to view in the library
          </a>
        )}
      </div>
    </Tag>
  );
};

export default ItemRequestButton;
