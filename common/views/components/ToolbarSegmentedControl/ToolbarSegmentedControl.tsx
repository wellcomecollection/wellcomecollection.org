import { FunctionComponent, SyntheticEvent } from 'react';
import Icon from '../Icon/Icon';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import Space from '../styled/Space';
import { IconSvg } from '@weco/common/icons';

const List = styled.ul`
  margin: 0 !important;
  padding: 0;
  list-style: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${props => props.theme.color('pewter')};
  border-radius: 5px;
`;

const Item = styled.li<{ isActive: boolean }>`
  ${props =>
    props.isActive &&
    `
    background: ${props.theme.color('pewter')};
  `}
`;

const Button = styled.button.attrs({
  type: 'button',
  className: 'plain-button',
})`
  display: flex;
  margin: 0 !important;
  padding: 0;
`;

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
  className: font('intb', 5),
})<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.color('white')};
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
                color={activeId === item.id ? 'yellow' : 'pewter'}
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
