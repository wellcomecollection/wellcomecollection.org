import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
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

const RedirectModalTitle = styled.h2.attrs({
  className: font('brand-bold', 1),
})`
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 24px;
`;

const CountdownText = styled.span.attrs({ className: font('brand-bold', 5) })`
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
  onKeepBrowsing: () => void;
  onReset: () => void;
};

const InactivityRedirectModal: FunctionComponent<Props> = ({
  countdown,
  onKeepBrowsing,
  onReset,
}) => {
  return (
    <RedirectModalContent
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="inactivity-modal-title"
      aria-describedby="inactivity-modal-desc"
    >
      {/* Receives initial focus so screen readers announce the dialog context before the buttons */}
      <RedirectModalTitle id="inactivity-modal-title" tabIndex={0}>
        Still with us?
      </RedirectModalTitle>

      <p id="inactivity-modal-desc">
        Due to inactivity, this page will time out and reset to the homepage.
        <span className="visually-hidden">
          Select 'Continue reading' to continue, or 'Reset now' to reset
          immediately.
        </span>
      </p>

      <CountdownText data-chromatic="ignore" aria-hidden="true">
        {countdown}
      </CountdownText>

      <ButtonRow>
        <Button
          variant="ButtonSolid"
          text="Continue reading"
          clickHandler={onKeepBrowsing}
          colors={themeValues.buttonColors.greenGreenWhite}
          dataGtmProps={{ trigger: 'reset-modal-keep-browsing-button' }}
        />
        <Button
          variant="ButtonSolid"
          text="Reset now"
          clickHandler={onReset}
          colors={themeValues.buttonColors.greenTransparentGreen}
          dataGtmProps={{ trigger: 'reset-modal-reset-now-button' }}
        />
      </ButtonRow>
    </RedirectModalContent>
  );
};

export default InactivityRedirectModal;
