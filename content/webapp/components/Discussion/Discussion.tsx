import { FunctionComponent, useState, useEffect, useContext } from 'react';
import { HTMLString } from '@weco/common/services/prismic/types';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import styled from 'styled-components';
import { plus } from '@weco/common/icons';

const ButtonContainer = styled.div`
  position: absolute;
  z-index: 3;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

export type Props = {
  title: string | null;
  text: HTMLString;
};

const Discussion: FunctionComponent<Props> = ({ title, text }: Props) => {
  const { isEnhanced } = useContext(AppContext);
  const [isActive, setIsActive] = useState(true);
  const [textToShow, setTextToShow] = useState(text);
  const lowercaseTitle = title?.toLowerCase();
  const firstPartOfText = text?.slice(0, 2);
  useEffect(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (isActive) {
      setTextToShow(text);
    } else {
      setTextToShow(firstPartOfText);
    }
  }, [isActive]);

  return (
    <>
      {title && <h2 className="h2">{title}</h2>}
      {textToShow && (
        <div id="discussion-container" aria-live="polite">
          <PrismicHtmlBlock html={textToShow} />
          {isEnhanced && (
            <ButtonContainer>
              <ButtonSolid
                ariaControls={'discussion-container'}
                ariaExpanded={isActive}
                icon={plus}
                clickHandler={() => {
                  setIsActive(!isActive);
                }}
                text={
                  isActive
                    ? `Hide ${lowercaseTitle}`
                    : `Read full ${lowercaseTitle}`
                }
              />
            </ButtonContainer>
          )}
        </div>
      )}
    </>
  );
};
export default Discussion;
