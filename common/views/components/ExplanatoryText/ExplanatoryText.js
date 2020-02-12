// @flow
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { useState, useEffect, useContext, type Element } from 'react';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

const IconContainer = styled.div`
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background: ${props =>
    props.open ? props.theme.colors.black : props.theme.colors.green};
`;
const Control = styled.button.attrs(props => ({
  className: classNames({
    'plain-button': true,
    flex: true,
    'flex--v-center': true,
    [font('hnm', 5)]: true,
  }),
}))`
  cursor: pointer;
  padding: 0;
`;

const ControlText = styled.span`
  text-decoration: underline;
`;

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
        <Control
          aria-controls={id}
          aria-expanded={showContent}
          onClick={() => {
            setShowContent(!showContent);
          }}
        >
          <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
            <IconContainer open={showContent}>
              <Icon
                name="plus"
                extraClasses={`${
                  showContent ? 'icon--45' : ''
                } icon--white icon--match-text`}
              />
            </IconContainer>
          </Space>
          <ControlText>{headingText}</ControlText>
        </Control>
      )}
      <Content id={id} aria-hidden={!showContent} hidden={!showContent} aria>
        {children}
      </Content>
    </>
  );
};

export default ExplanatoryText;
