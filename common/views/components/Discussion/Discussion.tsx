import { FunctionComponent, useState, useEffect, useContext } from 'react';
import { HTMLString } from '../../../services/prismic/types';
import { Person } from '../../../model/people';
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
  discussion: {
    contributor: Person | null;
    text: HTMLString | null;
  }[];
};

const Discussion: FunctionComponent<Props> = ({ title, discussion }: Props) => {
  const { isEnhanced } = useContext(AppContext);
  const textWithContributorNameAdded = discussion.map(section => {
    const contributor = `${section?.contributor?.name}:`;
    return (
      section.text &&
      section.text.map((text, i) => {
        if (i === 0 && section.contributor) {
          return {
            type: text.type,
            text: `${contributor} ${text.text}`,
            spans: [
              {
                start: 0,
                end: contributor.length,
                type: 'strong',
              },
              ...text.spans,
            ],
          };
        } else {
          return text;
        }
      })
    );
  });

  const [first] = textWithContributorNameAdded;
  const [isActive, setIsActive] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(textWithContributorNameAdded);

  useEffect(() => {
    setItemsToShow([first]);
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (isActive) {
      setItemsToShow(textWithContributorNameAdded);
    } else {
      setItemsToShow([first]);
    }
  }, [isActive]);

  return (
    <>
      {title && <h2 className="h2">{title}</h2>}
      <Container
        isActive={isActive}
        id="discussion-container"
        aria-live="polite"
      >
        {itemsToShow.map((section, i) => (
          <PrismicHtmlBlock key={i} html={section} />
        ))}
        {isEnhanced && (
          <ButtonContainer isActive={isActive}>
            <ButtonSolid
              ariaControls={'discussion-container'}
              ariaExpanded={isActive}
              icon="plus"
              clickHandler={() => {
                setIsActive(!isActive);
              }}
              text={isActive ? 'Hide full transcript' : 'Read full transcript'}
            />
          </ButtonContainer>
        )}
      </Container>
    </>
  );
};
export default Discussion;
