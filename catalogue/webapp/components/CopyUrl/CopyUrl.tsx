import {
  useState,
  useContext,
  useRef,
  ReactElement,
  FunctionComponent,
} from 'react';
import { trackEvent } from '@weco/common/utils/ga';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Space from '@weco/common/views/components/styled/Space';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import ButtonInline from '@weco/common/views/components/ButtonInline/ButtonInline';
import { check } from '@weco/common/icons';

type Props = {
  id: string;
  url: string;
};

const CopyUrl: FunctionComponent<Props> = ({
  id,
  url,
}: Props): ReactElement<Props> => {
  const { isEnhanced } = useContext(AppContext);
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function getButtonMarkup() {
    if (!isClicked) {
      return 'Copy URL';
    } else if (isTextCopied) {
      return 'Copied';
    } else {
      return 'Copy failed';
    }
  }

  function handleButtonClick() {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('style', 'position: fixed; left: -9999px;');
    textarea.innerHTML = url;
    document.body && document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      setIsTextCopied(true);
    } catch (err) {
      setIsTextCopied(false);
    }

    setIsClicked(true);

    buttonRef.current && buttonRef.current.focus();
    textarea.remove();

    trackEvent({
      category: 'CopyUrl',
      action: 'copy url to clipboard',
      label: id,
    });
  }

  return (
    <>
      <TextInput
        id="share"
        type="text"
        label="Page URL"
        value={url}
        setValue={() => {
          // noop
        }}
      />

      {isEnhanced && (
        <Space
          v={{
            size: 'm',
            properties: ['margin-top'],
          }}
        >
          <ButtonInline
            aria-live="polite"
            clickHandler={handleButtonClick}
            ref={buttonRef}
            text={getButtonMarkup()}
            icon={isTextCopied ? check : undefined}
          />
        </Space>
      )}
    </>
  );
};

export default CopyUrl;
