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

const IconContainer = styled.div<{
  open: boolean;
}>`
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
  font-weight: normal;
  margin: 0;
`;

const Content = styled(Space).attrs({
  className: 'body-text spaced-text',
  h: {
    size: 'l',
    properties: ['padding-left', 'padding-right'],
  },
})<{
  hidden: boolean;
}>`
  display: ${props => (props.hidden ? 'none' : 'block')};
`;

type Props = PropsWithChildren<{
  id: string;
  controlText: {
    defaultText: string;
    contentShowingText?: string;
  };
}>;

const CollapsibleContent: FunctionComponent<Props> = ({
  id,
  controlText,
  children,
}: Props) => {
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
            {showContent
              ? controlText.contentShowingText || controlText.defaultText
              : controlText.defaultText}
          </ControlText>
        </Control>
      )}
      <Content id={id} aria-hidden={!showContent} hidden={!showContent}>
        <Space v={{ size: 'l', properties: ['margin-top'] }}>{children}</Space>
      </Content>
    </div>
  );
};

export default CollapsibleContent;
