import { FunctionComponent, SyntheticEvent } from 'react';
import Icon from '../Icon/Icon';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import Space from '../styled/Space';
import { IconSvg } from '@weco/common/icons';

const List = styled.ul.attrs({
  className:
    'no-margin no-padding plain-list flex-inline flex--v-center flex--h-center',
})`
  border: 2px solid ${props => props.theme.newColor('neutral.600')};
  border-radius: 5px;
`;

const Item = styled.li<{ isActive: boolean }>`
  ${props =>
    props.isActive &&
    `
    background: ${props.theme.newColor('neutral.600')};
  `}
`;

const Button = styled.button.attrs({
  type: 'button',
  className: 'flex plain-button no-margin no-padding',
})``;

const ButtonInner = styled(Space).attrs({
  as: 'span',
  h: {
    size: 'xs',
    properties: ['padding-right', 'padding-left'],
  },
  v: {
    size: 'xs',
    properties: ['padding-top', 'padding-bottom'],
  },
  className: `flex flex--v-center flex--h-center ${font('intb', 5)}`,
})<{ isActive: boolean }>`
  color: ${props => props.theme.newColor('white')};
`;

type Props = {
  activeId: string;
  hideLabels?: boolean;
  items: {
    id: string;
    icon: IconSvg;
    label: string;
    clickHandler: (event: SyntheticEvent) => void;
  }[];
};

const ToolbarSegmentedControl: FunctionComponent<Props> = ({
  items,
  activeId,
  hideLabels,
}: Props) => {
  return (
    <List>
      {items.map(item => (
        <Item isActive={activeId === item.id} key={item.id}>
          <Button onClick={item.clickHandler}>
            <ButtonInner isActive={activeId === item.id}>
              <Icon
                icon={item.icon}
                color={activeId === item.id ? 'yellow' : 'neutral.600'}
              />
              <Space
                h={
                  hideLabels
                    ? undefined
                    : {
                        size: 'xs',
                        properties: ['padding-left', 'padding-right'],
                      }
                }
                className={hideLabels ? 'visually-hidden' : undefined}
              >
                {item.label}
              </Space>
            </ButtonInner>
          </Button>
        </Item>
      ))}
    </List>
  );
};

export default ToolbarSegmentedControl;
