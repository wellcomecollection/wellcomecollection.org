import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';

const RedirectModalContent = styled(Space).attrs({
  $v: { size: 'md', properties: ['padding-top'] },
})`
  text-align: center;
`;

const RedirectModalTitle = styled.h2.attrs({
  className: font('brand-bold', 1),
})`
  margin-bottom: ${props => props.theme.getSpaceValue('md', 'zero')};
`;

const Copy = styled.p`
  margin-bottom: ${props => props.theme.getSpaceValue('md', 'zero')};
`;

const ButtonRow = styled(Space).attrs({
  $v: { size: 'md', properties: ['margin-top'] },
})`
  display: flex;
  gap: 10px;
  justify-content: center;
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
      <RedirectModalTitle id="inactivity-modal-title">
        Still with us?
      </RedirectModalTitle>

      <Copy id="inactivity-modal-desc">
        Due to inactivity, this page will time out and reset to the homepage.
        <span className="visually-hidden">
          {countdown} seconds remaining. Select 'Continue reading' to continue,
          or 'Reset now' to reset immediately.
        </span>
      </Copy>

      <span
        data-chromatic="ignore"
        aria-hidden="true"
        className={font('brand-bold', 5)}
      >
        {countdown}
      </span>

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
