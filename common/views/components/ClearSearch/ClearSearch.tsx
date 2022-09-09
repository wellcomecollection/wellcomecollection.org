import { FunctionComponent, RefObject, Dispatch, SetStateAction } from 'react';
import { trackEvent, GaEvent } from '../../../utils/ga';
import Icon from '../Icon/Icon';
import { clear } from '@weco/common/icons';

type Props = {
  inputRef: RefObject<HTMLInputElement>;
  setValue: Dispatch<SetStateAction<string>>;
  gaEvent?: GaEvent;
  right?: number;
};
const ClearSearch: FunctionComponent<Props> = ({
  inputRef,
  setValue,
  gaEvent,
  right,
}: Props) => {
  return (
    <button
      style={right ? { right: `${right}px` } : undefined}
      className="absolute line-height-1 plain-button v-center no-padding"
      onClick={() => {
        gaEvent && trackEvent(gaEvent);
        setValue('');
        inputRef?.current?.focus();
      }}
      type="button"
    >
      <Icon icon={clear} title="Clear" />
    </button>
  );
};

export default ClearSearch;
