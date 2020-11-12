import {
  useState,
  useContext,
  useRef,
  ReactElement,
  FunctionComponent,
} from 'react';
import { trackEvent } from '../../../utils/ga';
import TextInput from '../TextInput/TextInput';
import Space from '../styled/Space';
import { AppContext } from '../AppContext/AppContext';
import ButtonInline from '../ButtonInline/ButtonInline';

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
  const buttonRef = useRef(null);

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
        setValue={null}
        name={null}
        pattern={null}
        required={null}
        placeholder={null}
        errorMessage={null}
        isValid={null}
        setIsValid={null}
        showValidity={null}
        setShowValidity={null}
        autoFocus={null}
        big={null}
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
            icon={isTextCopied ? 'check' : null}
          />
        </Space>
      )}
    </>
  );
};

export default CopyUrl;
