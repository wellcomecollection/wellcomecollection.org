import { FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
import { allowedRequests } from '@weco/common/values/requests';
import Button from '@weco/common/views/components/Buttons';

import CurrentRequests from './ItemRequestModal.CurrentRequests';
import { CTAs, Header } from './ItemRequestModal.styles';

type ConfirmedDialogProps = {
  currentHoldNumber?: number;
  pickUpDate?: string;
};

const ConfirmedDialog: FunctionComponent<ConfirmedDialogProps> = ({
  currentHoldNumber,
  pickUpDate,
}) => {
  return (
    <>
      <Header>
        <span className={font('wb', 1)}>Request confirmed</span>
        <CurrentRequests
          allowedHoldRequests={allowedRequests}
          currentHoldRequests={currentHoldNumber}
        />
      </Header>
      <p>
        It will be available to pick up from the library (Rare Materials Room,
        level&nbsp;3) for one week from{' '}
        {pickUpDate || 'your selected pickup date'}.
      </p>
      <CTAs>
        <Button
          variant="ButtonSolidLink"
          text="View your library account"
          link="/account"
        />
      </CTAs>
    </>
  );
};

export default ConfirmedDialog;
