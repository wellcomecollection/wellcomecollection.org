import { FunctionComponent } from 'react';
import { defaultRequestErrorMessage } from '@weco/common/data/microcopy';
import Button from '@weco/common/views/components/Buttons';
import { CTAs, Header } from './common';
import { themeValues } from '@weco/common/views/themes/config';
import { font } from '@weco/common/utils/classnames';

type ErrorDialogProps = {
  setIsActive: (value: boolean) => void;
  errorMessage: string | undefined;
};

const ErrorDialog: FunctionComponent<ErrorDialogProps> = ({
  setIsActive,
  errorMessage,
}) => (
  <>
    <Header>
      <span className={font('wb', 3)}>Request failed</span>
    </Header>
    <p style={{ marginBottom: 0 }}>
      {errorMessage || defaultRequestErrorMessage}
    </p>
    <CTAs>
      <Button
        variant="ButtonSolid"
        colors={themeValues.buttonColors.greenTransparentGreen}
        text="Close"
        clickHandler={() => setIsActive(false)}
      />
    </CTAs>
  </>
);

export default ErrorDialog;
