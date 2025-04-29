import {
  FunctionComponent,
  MutableRefObject,
  useEffect,
  useState,
} from 'react';

import Modal from '@weco/common/views/components/Modal';
import LL from '@weco/common/views/components/styled/LL';
import { WellcomeApiError } from '@weco/content/services/wellcome';
import {
  PhysicalItem,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';

import ConfirmedDialog from './ConfirmedDialog';
import ErrorDialog from './ErrorDialog';
import { dateAsValue, formatDateForRequestsAPI } from './format-date';
import RequestDialog from './RequestDialog';

type Props = {
  work: Work;
  item: PhysicalItem;
  isActive: boolean;
  onSuccess: () => void;
  setIsActive: (value: boolean) => void;
  openButtonRef: MutableRefObject<HTMLButtonElement | null>;
  initialHoldNumber?: number;
};

type RequestingState = 'initial' | 'requesting' | 'confirmed' | 'error';

const ItemRequestModal: FunctionComponent<Props> = ({
  item,
  work,
  setIsActive,
  initialHoldNumber,
  onSuccess,
  openButtonRef,
  ...modalProps
}) => {
  const [requestingState, setRequestingState] =
    useState<RequestingState>('initial');
  const [requestingErrorMessage, setRequestingError] = useState<string>();
  const [currentHoldNumber, setCurrentHoldNumber] = useState(initialHoldNumber);
  const [pickUpDate, setPickUpDate] = useState<string | undefined>(
    item.availableDates && dateAsValue(new Date(item.availableDates[0].from))
  );

  function innerSetIsActive(value: boolean) {
    if (requestingState === 'requesting') return; // we don't want the modal to close during an api call
    if (value) {
      setIsActive(true);
    } else {
      setIsActive(false);
      if (requestingState !== 'confirmed') {
        setRequestingState('initial');
      }
    }
  }

  useEffect(() => {
    setCurrentHoldNumber(initialHoldNumber);
  }, [initialHoldNumber]); // This will update when the PhysicalItemDetails component renders and the userHolds are updated

  async function confirmRequest(pickupDate: Date) {
    setRequestingState('requesting');
    try {
      const response = await fetch('/account/api/users/me/item-requests', {
        method: 'POST',
        body: JSON.stringify({
          workId: work.id,
          itemId: item.id,
          pickupDate: formatDateForRequestsAPI(pickupDate),
          type: 'Item',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const responseJson = (await response.json()) as WellcomeApiError;
        setRequestingState('error');
        setRequestingError(responseJson.description);
      } else {
        setRequestingState('confirmed');
        // If we get the users current holds, immediately following a successful request, the api response isn't updated quickly enough to include the new request
        // We therefore increment the currentHoldNumber manually following a successful request
        setCurrentHoldNumber(holdNumber => (holdNumber || 0) + 1);
        onSuccess();
      }
    } catch (error) {
      setRequestingState('error');
    }
  }

  function renderModalContent() {
    switch (requestingState) {
      case 'requesting':
        return <LL />;
      case 'error':
        return (
          <ErrorDialog
            setIsActive={innerSetIsActive}
            errorMessage={requestingErrorMessage}
          />
        );
      case 'confirmed':
        return (
          <ConfirmedDialog
            currentHoldNumber={currentHoldNumber}
            pickUpDate={pickUpDate}
          />
        );
      case 'initial':
        return (
          <RequestDialog
            work={work}
            item={item}
            confirmRequest={confirmRequest}
            setIsActive={innerSetIsActive}
            currentHoldNumber={currentHoldNumber}
            pickUpDate={pickUpDate}
            setPickUpDate={setPickUpDate}
          />
        );
    }
  }

  return (
    <Modal
      {...modalProps}
      removeCloseButton={requestingState === 'requesting'}
      id="confirm-request-modal"
      setIsActive={innerSetIsActive}
      openButtonRef={openButtonRef}
    >
      <div aria-live="assertive">{renderModalContent()}</div>
    </Modal>
  );
};

export default ItemRequestModal;
