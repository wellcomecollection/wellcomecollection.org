import { FunctionComponent } from 'react';
import { CTAs, CurrentRequests, Header } from './common';
import { allowedRequests } from '@weco/common/values/requests';
import Button from '@weco/common/views/components/Buttons';
import { font } from '@weco/common/utils/classnames';

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
        <span className={font('wb', 3)}>Request confirmed</span>
        <CurrentRequests
          allowedHoldRequests={allowedRequests}
          currentHoldRequests={currentHoldNumber}
        />
      </Header>
      <p>
        It will be available to pick up from the library (Rare Materials Room,
        level&nbsp;3) for one week from {pickUpDate}.
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
