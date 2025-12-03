import { FunctionComponent } from 'react';
import { useTheme } from 'styled-components';

import { defaultRequestErrorMessage } from '@weco/common/data/microcopy';
import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';

import { CTAs, Header } from './ItemRequestModal.styles';

type ErrorDialogProps = {
  setIsActive: (value: boolean) => void;
  errorMessage: string | undefined;
};

const ErrorDialog: FunctionComponent<ErrorDialogProps> = ({
  setIsActive,
  errorMessage,
}) => {
  const theme = useTheme();

  return (
    <>
      <Header>
        <span className={font('wb', 1)}>Request failed</span>
      </Header>
      <p style={{ marginBottom: 0 }}>
        {errorMessage || defaultRequestErrorMessage}
      </p>
      <CTAs>
        <Button
          variant="ButtonSolid"
          colors={theme.buttonColors.greenTransparentGreen}
          text="Close"
          clickHandler={() => setIsActive(false)}
        />
      </CTAs>
    </>
  );
};

export default ErrorDialog;
