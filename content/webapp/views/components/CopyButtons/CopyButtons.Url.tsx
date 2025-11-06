import { FunctionComponent, ReactElement, useRef, useState } from 'react';
import { useTheme } from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { check } from '@weco/common/icons';
import Button from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import TextInput from '@weco/common/views/components/TextInput';

export type Props = {
  url: string;
};

const CopyUrl: FunctionComponent<Props> = ({
  url,
}: Props): ReactElement<Props> => {
  const { isEnhanced } = useAppContext();
  const theme = useTheme();
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
          $v={{
            size: 'm',
            properties: ['margin-top'],
          }}
        >
          <Button
            variant="ButtonSolid"
            dataGtmProps={{
              trigger: 'copy_url',
            }}
            colors={theme.buttonColors.pumiceTransparentCharcoal}
            size="small"
            aria-live="assertive"
            clickHandler={handleButtonClick}
            ref={buttonRef}
            text={getButtonMarkup()}
            icon={isTextCopied ? check : undefined}
            isIconAfter={true}
          />
        </Space>
      )}
    </>
  );
};

export default CopyUrl;
