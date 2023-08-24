import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import {
  useState,
  useEffect,
  useContext,
  FunctionComponent,
  PropsWithChildren,
} from 'react';
import styled from 'styled-components';
import { plus } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

type IconContainerProps = {
  open: boolean;
};

const IconContainer = styled.div<IconContainerProps>`
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background: ${props =>
    props.theme.color(props.open ? 'black' : 'accent.green')};

  .icon {
    transition: transform 300ms ease;
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

const Content = styled.div<ContentProps>`
  display: ${props => (props.hidden ? 'none' : 'block')};
`;

type Props = PropsWithChildren<{
  id: string;
  controlText: string;
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
              <Icon
                icon={plus}
                rotate={showContent ? 45 : undefined}
                matchText={true}
                iconColor="white"
              />
            </IconContainer>
          </Space>
          <ControlText>{controlText}</ControlText>
        </Control>
      )}
      <Content id={id} aria-hidden={!showContent} hidden={!showContent}>
        <Space v={{ size: 'l', properties: ['margin-top'] }}>{children}</Space>
      </Content>
    </div>
  );
};

export default ExplanatoryText;
