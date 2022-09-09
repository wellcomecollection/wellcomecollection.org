import { FC } from 'react';
import { defaultRequestErrorMessage } from '@weco/common/data/microcopy';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { CTAs, Header } from './common';
import { themeValues } from '@weco/common/views/themes/config';

type ErrorDialogProps = {
  setIsActive: (value: boolean) => void;
  errorMessage: string | undefined;
};

const ErrorDialog: FC<ErrorDialogProps> = ({ setIsActive, errorMessage }) => (
  <>
    <Header>
      <span className="h2">Request failed</span>
    </Header>
    <p className="no-margin">{errorMessage || defaultRequestErrorMessage}</p>
    <CTAs>
      <ButtonSolid
        colors={themeValues.buttonColors.greenTransparentGreen}
        text={`Close`}
        clickHandler={() => setIsActive(false)}
      />
    </CTAs>
  </>
);

export default ErrorDialog;
