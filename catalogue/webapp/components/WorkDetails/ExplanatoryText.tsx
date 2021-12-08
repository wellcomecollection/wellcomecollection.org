import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { useState, useEffect, useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { plus } from '@weco/common/icons';
import { classNames, font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

const IconContainer = styled.div`
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background: ${props => props.theme.color(props.open ? 'black' : 'green')};

  .icon {
    transition: transform 300ms ease;
  }
`;
const Control = styled.button.attrs({
  className: classNames({
    'plain-button': true,
    flex: true,
    'flex--v-center': true,
    [font('hnb', 5)]: true,
  }),
})`
  cursor: pointer;
  padding: 0;
  &:focus {
    outline: ${props => (!props.hideFocus ? 'intial' : 'none')};
  }
`;

const ControlText = styled.span`
  text-decoration: underline;
`;

const Content = styled.div`
  display: ${props => (props.hidden ? 'none' : 'block')};
`;

type Props = {
  id: string;
  controlText: string;
  children: ReactElement;
};

const ExplanatoryText = ({ id, controlText, children }: Props) => {
  const { isEnhanced, isKeyboard } = useContext(AppContext);
  const [showContent, setShowContent] = useState(true);
  useEffect(() => {
    setShowContent(false);
  }, []);
  return (
    <div>
      {isEnhanced && (
        <Control
          aria-controls={id}
          aria-expanded={showContent}
          onClick={() => {
            setShowContent(!showContent);
          }}
          hideFocus={!isKeyboard}
        >
          <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
            <IconContainer open={showContent}>
              <Icon
                icon={plus}
                rotate={showContent ? 45 : undefined}
                matchText={true}
                color={'white'}
              />
            </IconContainer>
          </Space>
          <ControlText>{controlText}</ControlText>
        </Control>
      )}
      <Content id={id} aria-hidden={!showContent} hidden={!showContent}>
        <Space
          v={{
            size: 'l',
            properties: ['margin-top'],
          }}
        >
          {children}
        </Space>
      </Content>
    </div>
  );
};

export default ExplanatoryText;
