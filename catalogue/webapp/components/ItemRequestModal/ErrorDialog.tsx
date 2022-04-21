import { FC } from 'react';
import { defaultRequestErrorMessage } from '@weco/common/data/microcopy';
import ButtonOutlined from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import { CTAs, Header } from './common';

type ErrorDialogProps = {
  setIsActive: (value: boolean) => void;
  errorMessage: string | undefined;
};

const ErrorDialog: FC<ErrorDialogProps> = ({ setIsActive, errorMessage }) => (
  <>
    <Header>
      <span className={`h2`}>Request failed</span>
    </Header>
    <p className="no-margin">{errorMessage || defaultRequestErrorMessage}</p>
    <CTAs>
      <ButtonOutlined text={`Close`} clickHandler={() => setIsActive(false)} />
    </CTAs>
  </>
);

export default ErrorDialog;
