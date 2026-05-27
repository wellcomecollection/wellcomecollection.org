import { FunctionComponent } from 'react';
import styled from 'styled-components';

import Button from '@weco/common/views/components/Buttons';
import { themeValues } from '@weco/common/views/themes/config';

const RedirectModalContent = styled.div`
  padding: 24px;
  text-align: center;

  p {
    margin: 16px 0;
    font-size: 18px;
    line-height: 1.5;
  }
`;

const RedirectModalTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 24px;
`;

const CountdownText = styled.strong`
  display: block;
  font-size: 32px;
  font-weight: bold;
  margin-top: 16px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
`;

type Props = {
  countdown: number;
  warningCountdown: number;
  onKeepBrowsing: () => void;
  onReset: () => void;
};

const InactivityRedirectModal: FunctionComponent<Props> = ({
  countdown,
  warningCountdown,
  onKeepBrowsing,
  onReset,
}) => {
  return (
    <RedirectModalContent>
      <RedirectModalTitle>Need more time?</RedirectModalTitle>
      <p>
        This screen will reset in {warningCountdown} seconds for the next
        visitor.
      </p>
      <CountdownText data-chromatic="ignore">{countdown}</CountdownText>
      <ButtonRow>
        <Button
          variant="ButtonSolid"
          text="Keep browsing"
          clickHandler={onKeepBrowsing}
          colors={themeValues.buttonColors.greenGreenWhite}
          dataGtmProps={{ trigger: 'reset-modal-keep-browsing-button' }}
        />
        <Button
          variant="ButtonSolid"
          text="Reset now"
          clickHandler={onReset}
          colors={themeValues.buttonColors.yellowYellowBlack}
          dataGtmProps={{ trigger: 'reset-modal-reset-now-button' }}
        />
      </ButtonRow>
    </RedirectModalContent>
  );
};

export default InactivityRedirectModal;
