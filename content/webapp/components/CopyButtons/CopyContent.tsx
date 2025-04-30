import {
  FunctionComponent,
  ReactElement,
  useContext,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import AppContext from '@weco/common/contexts/AppContext';
import { check } from '@weco/common/icons';
import Button from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';

type Props = {
  CTA: string;
  content: string;
  displayedContent?: ReactElement;
};

const ButtonContainer = styled(Space).attrs({
  $v: { size: 'm', properties: ['margin-top'] },
})`
  /* This hack is needed to override the spacing caused by being placed within a div with .spaced-text. */
  span {
    margin: 0;
  }
`;

const CopyContent: FunctionComponent<Props> = ({
  CTA,
  content,
  displayedContent,
}: Props): ReactElement<Props> => {
  const { isEnhanced } = useContext(AppContext);
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function getButtonMarkup() {
    if (!isClicked) {
      return CTA;
    } else if (isTextCopied) {
      return 'Copied';
    } else {
      return 'Copy failed';
    }
  }

  function handleButtonClick() {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('style', 'position: fixed; left: -9999px;');
    textarea.innerHTML = content;
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
      {displayedContent && displayedContent}
      {isEnhanced && (
        <ButtonContainer>
          <Button
            variant="ButtonSolid"
            dataGtmTrigger="copy_content"
            colors={themeValues.buttonColors.pumiceTransparentCharcoal}
            size="small"
            aria-live="assertive"
            clickHandler={handleButtonClick}
            ref={buttonRef}
            text={getButtonMarkup()}
            icon={isTextCopied ? check : undefined}
            isIconAfter={true}
          />
        </ButtonContainer>
      )}
    </>
  );
};

export default CopyContent;
