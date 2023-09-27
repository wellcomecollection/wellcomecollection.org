import { FunctionComponent, RefObject, Dispatch, SetStateAction } from 'react';
import { trackGaEvent, GaEvent } from '@weco/common/utils/ga';
import Icon from '@weco/common/views/components/Icon/Icon';
import { clear } from '@weco/common/icons';
import styled from 'styled-components';

const Button = styled.button`
  position: absolute;
  line-height: 1;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
`;

type Props = {
  inputRef: RefObject<HTMLInputElement>;
  setValue: Dispatch<SetStateAction<string>>;
  clickHandler?: () => void;
  gaEvent?: GaEvent;
  right?: number;
};

const ClearSearch: FunctionComponent<Props> = ({
  inputRef,
  setValue,
  gaEvent,
  right,
  clickHandler,
}: Props) => {
  return (
    <Button
      style={right ? { right: `${right}px` } : undefined}
      onClick={() => {
        gaEvent && trackGaEvent(gaEvent);
        setValue('');
        clickHandler && clickHandler();
        inputRef?.current?.focus();
      }}
      type="button"
      aria-label="clear"
    >
      <Icon iconColor="black" icon={clear} title="Clear" />
    </Button>
  );
};

export default ClearSearch;
