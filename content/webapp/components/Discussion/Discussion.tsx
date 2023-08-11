import { FunctionComponent, useState, useEffect, useContext } from 'react';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import styled from 'styled-components';
import { plus, minus } from '@weco/common/icons';
import * as prismic from '@prismicio/client';
import { font } from '@weco/common/utils/classnames';

const ButtonContainer = styled.div`
  position: absolute;
  z-index: 3;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

export type Props = {
  title: string | null;
  text: prismic.RichTextField;
};

const Discussion: FunctionComponent<Props> = ({ title, text }: Props) => {
  const { isEnhanced } = useContext(AppContext);
  const [isActive, setIsActive] = useState(true);
  const [textToShow, setTextToShow] = useState(text);
  const firstPartOfText = text?.slice(0, 2);
  useEffect(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (isActive) {
      setTextToShow(text);
    } else {
      setTextToShow(firstPartOfText as [prismic.RTNode, ...prismic.RTNode[]]);
    }
  }, [isActive]);

  return (
    <>
      {title && <h2 className={font('wb', 3)}>{title}</h2>}
      {textToShow && (
        <div id="discussion-container" aria-live="polite">
          <PrismicHtmlBlock html={textToShow} />
          {isEnhanced && (
            <ButtonContainer>
              <ButtonSolid
                dataGtmTrigger={
                  isActive ? 'hide_transcript' : 'show_transcript'
                }
                ariaControls="discussion-container"
                ariaExpanded={isActive}
                icon={isActive ? minus : plus}
                clickHandler={() => {
                  setIsActive(!isActive);
                }}
                text={
                  isActive ? 'Hide full transcript' : 'Read full transcript'
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
