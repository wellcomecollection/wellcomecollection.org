import {useState, useContext, useRef} from 'react';
import { classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import Icon from '../Icon/Icon';
import HTMLInput from '../HTMLInput/HTMLInput';
import Space from '../styled/Space';
import { AppContext } from '../AppContext/AppContext';

type Props = {
  id: string;
  url: string;
};


const CopyUrl = ({id, url}: Props) => {
  const {isEnhanced} = useContext(AppContext);
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const inputRef = useRef(null);

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

    textarea.remove();

    inputRef.current && inputRef.current.focus();

    trackEvent({
      category: 'CopyUrl',
      action: 'copy url to clipboard',
      label: id,
    });
  };

  return (
    <>
      <HTMLInput
        inputRef={inputRef}
        id="share"
        type="text"
        label="share url"
        defaultValue={url}
        isLabelHidden={true}
      />

      <Space
        v={{
          size: 'm',
          properties: ['margin-top'],
        }}
        aria-live="polite"
        onClick={handleButtonClick}
        data-copy-text={url}
        className={classNames({
          'is-hidden': !isEnhanced,
        })}
      >
        <span>
          <Icon
            name="check"
            extraClasses={classNames({
              'icon--inherit icon--match-text': true,
              'is-hidden': !isTextCopied,
            })}
          />
          <span>{getButtonMarkup(isTextCopied, isClicked)}</span>
        </span>
      </Space>
    </>
  );
};

export default CopyUrl;
