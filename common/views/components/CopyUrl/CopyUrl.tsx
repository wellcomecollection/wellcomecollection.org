import {useState, useContext, useRef} from 'react';
import { classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import Icon from '../Icon/Icon';
import TextInput from '../TextInput/TextInput';
import Space from '../styled/Space';
import { AppContext } from '../AppContext/AppContext';
import { InlineButton } from '../ButtonInline/ButtonInline';

type Props = {
  id: string;
  url: string;
};


const CopyUrl = ({id, url}: Props) => {
  const {isEnhanced} = useContext(AppContext);
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const buttonRef = useRef(null);

  function getButtonMarkup() {
    if (!isClicked) {
      return 'Copy URL';
    } else if (isTextCopied) {
      return (
        <>
          <span className="visually-hidden">link has been</span>Copied
        </>
      );
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
  };

  return (
    <>
      <TextInput
        id="share"
        type="text"
        label="share url"
        value={url}
        setValue={() => {}}
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

      {isEnhanced &&
        <Space
          v={{
            size: 'm',
            properties: ['margin-top'],
          }}
        >

          <InlineButton
            aria-live="polite"
            onClick={handleButtonClick}
            ref={buttonRef}
          >
            <span>{getButtonMarkup()}</span>
            <Icon
              name="check"
              extraClasses={classNames({
                'icon--inherit icon--match-text': true,
                'is-hidden': !isTextCopied,
              })}
            />
          </InlineButton>
        </Space>
      }
    </>
  );
};

export default CopyUrl;
