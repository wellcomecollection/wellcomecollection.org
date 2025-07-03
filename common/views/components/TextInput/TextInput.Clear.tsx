import { Dispatch, FunctionComponent, RefObject, SetStateAction } from 'react';
import styled from 'styled-components';

import { clear } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon';

const Button = styled.button`
  position: absolute;
  line-height: 1;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
`;

type Props = {
  inputRef: RefObject<HTMLInputElement | null>;
  setValue: Dispatch<SetStateAction<string>>;
  clickHandler?: () => void;
  right?: number;
};

const ClearSearch: FunctionComponent<Props> = ({
  inputRef,
  setValue,
  right,
  clickHandler,
}: Props) => {
  return (
    <Button
      style={right ? { right: `${right}px` } : undefined}
      onClick={() => {
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
