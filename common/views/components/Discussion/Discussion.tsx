import { FunctionComponent, useState, useEffect, useContext } from 'react';
import { HTMLString } from '../../../services/prismic/types';
import { AppContext } from '../AppContext/AppContext';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import ButtonSolid from '../ButtonSolid/ButtonSolid';
import styled from 'styled-components';

type ContainerProps = {
  isActive: boolean;
};

const Container = styled.div<ContainerProps>`
  margin-bottom: ${props => (props.isActive ? '-20px' : '-100px')};
`;
const ButtonContainer = styled.div<ContainerProps>`
  display: inline-block;
  position: relative;
  z-index: 3;
  left: 50%;
  transform: translateX(-50%);
  top: ${props => (props.isActive ? '0' : '-80px')};
`;

type Props = {
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
        <Container
          isActive={isActive}
          id="discussion-container"
          aria-live="polite"
        >
          <PrismicHtmlBlock html={textToShow} />
          {isEnhanced && (
            <ButtonContainer isActive={isActive}>
              <ButtonSolid
                ariaControls={'discussion-container'}
                ariaExpanded={isActive}
                icon="plus"
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
        </Container>
      )}
    </>
  );
};
export default Discussion;
