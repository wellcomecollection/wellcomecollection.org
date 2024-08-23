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

const IconContainer = styled.div<{ $darkTheme?: boolean }>`
  .icon {
    border-radius: 50%;
    border: 2px solid
      ${props => props.theme.color(props.$darkTheme ? 'yellow' : 'black')};
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
`;

const ControlText = styled.span<{ $darkTheme?: boolean }>`
  color: ${props =>
    props.$darkTheme ? props.theme.color('white') : undefined};
  text-decoration: underline;
  font-weight: normal;
  margin: 0;
`;

const Content = styled(Space).attrs({
  className: 'body-text spaced-text',
  $h: {
    size: 'l',
    properties: ['padding-left', 'padding-right'],
  },
})<{
  $hidden: boolean;
  $darkTheme?: boolean;
}>`
  color: ${props =>
    props.$darkTheme ? props.theme.color('white') : undefined};
  display: ${props => (props.$hidden ? 'none' : 'block')};
`;

type Props = PropsWithChildren<{
  id: string;
  darkTheme?: boolean;
  controlText: {
    defaultText: string;
    contentShowingText?: string;
  };
}>;

const CollapsibleContent: FunctionComponent<Props> = ({
  id,
  darkTheme,
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
          <Space as="span" $h={{ size: 's', properties: ['margin-right'] }}>
            <IconContainer $darkTheme={darkTheme}>
              <Icon
                iconColor={darkTheme ? 'yellow' : undefined}
                icon={showContent ? minus : plus}
              />
            </IconContainer>
          </Space>
          <ControlText $darkTheme={darkTheme}>
            {showContent
              ? controlText.contentShowingText || controlText.defaultText
              : controlText.defaultText}
          </ControlText>
        </Control>
      )}
      <Content
        id={id}
        aria-hidden={!showContent}
        $hidden={!showContent}
        $darkTheme={darkTheme}
      >
        <Space $v={{ size: 'l', properties: ['margin-top'] }}>{children}</Space>
      </Content>
    </div>
  );
};

export default CollapsibleContent;
