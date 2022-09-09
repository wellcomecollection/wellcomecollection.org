import { FC } from 'react';
import { CTAs, CurrentRequests, Header } from './common';
import { allowedRequests } from '@weco/common/values/requests';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';

type ConfirmedDialogProps = {
  currentHoldNumber?: number;
};

const ConfirmedDialog: FC<ConfirmedDialogProps> = ({ currentHoldNumber }) => {
  return (
    <>
      <Header>
        <span className="h2">Request confirmed</span>
        <CurrentRequests
          allowedHoldRequests={allowedRequests}
          currentHoldRequests={currentHoldNumber}
        />
      </Header>
      <p>
        It will be available to pick up from the library (Rare Materials Room,
        level 3) for one week from your selected pickup date.
      </p>
      <CTAs>
        <ButtonSolidLink text={`View your library account`} link={'/account'} />
      </CTAs>
    </>
  );
};

export default ConfirmedDialog;
