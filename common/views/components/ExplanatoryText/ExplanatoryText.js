// @flow
import { useState, useEffect, useContext, type Element } from 'react';
import styled from 'styled-components';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';

const Content = styled.div`
  hidden: ${props => props.hidden};
`;

type Props = {|
  id: string,
  headingText: string,
  children: Element<any>,
|};

const ExplanatoryText = ({ id, headingText, children }: Props) => {
  const { isEnhanced } = useContext(AppContext);
  const [showContent, setShowContent] = useState(true);
  useEffect(() => {
    setShowContent(false);
  }, []);
  return (
    <>
      {isEnhanced && (
        <button
          aria-controls={id}
          aria-expanded={showContent}
          onClick={() => {
            setShowContent(!showContent);
          }}
        >
          {headingText}
        </button>
      )}
      <Content id={id} aria-hidden={!showContent} hidden={!showContent} aria>
        {children}
      </Content>
    </>
  );
};

export default ExplanatoryText;
