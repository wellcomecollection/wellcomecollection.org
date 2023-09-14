import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import {
  useState,
  useEffect,
  useContext,
  FunctionComponent,
  PropsWithChildren,
} from 'react';
import styled from 'styled-components';
import { plus, minus } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

type IconContainerProps = {
  open: boolean;
};

const IconContainer = styled.div<IconContainerProps>`
  .icon {
    border-radius: 50%;
    border: 2px solid black;
    width: 20px;
    height: 20px;
  }
`;

const Control = styled.button.attrs({
  className: font('intb', 5),
})`
  display: flex;
  align-items: center;

  cursor: pointer;
  padding: 0;

  &:focus-visible,
  &:focus {
    outline: initial;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

const ControlText = styled.span`
  text-decoration: underline;
`;

type ContentProps = {
  hidden: boolean;
};

const Content = styled(Space).attrs({
  h: {
    size: 'l',
    properties: ['padding-left', 'padding-right'],
  },
})<ContentProps>`
  display: ${props => (props.hidden ? 'none' : 'block')};
`;

type Props = PropsWithChildren<{
  id: string;
  controlText: {
    closedText: string;
    openedText: string;
  };
}>;

const ExplanatoryText: FunctionComponent<Props> = ({
  id,
  controlText,
  children,
}) => {
  const { isEnhanced } = useContext(AppContext);
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
        >
          <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
            <IconContainer open={showContent}>
              <Icon icon={showContent ? minus : plus} />
            </IconContainer>
          </Space>
          <ControlText>
            {showContent ? controlText.openedText : controlText.closedText}
          </ControlText>
        </Control>
      )}
      <Content id={id} aria-hidden={!showContent} hidden={!showContent}>
        <Space v={{ size: 'l', properties: ['margin-top'] }}>{children}</Space>
      </Content>
    </div>
  );
};

export default ExplanatoryText;
