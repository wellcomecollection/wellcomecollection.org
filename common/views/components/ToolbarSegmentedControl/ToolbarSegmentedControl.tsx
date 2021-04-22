import { FunctionComponent, SyntheticEvent } from 'react';
import Icon from '../Icon/Icon';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import Space from '../styled/Space';

const List = styled.ul.attrs({
  className: classNames({
    'no-margin no-padding plain-list': true,
    'flex-inline flex--v-center flex--h-center': true,
  }),
})`
  border: 2px solid ${props => props.theme.color('charcoal')};
  border-radius: 3px;

  button {
    border-right: 2px solid ${props => props.theme.color('charcoal')};
  }
`;

const Item = styled.li<{ isActive: boolean }>`
  ${props =>
    props.isActive &&
    `
    background: ${props.theme.color('charcoal')};
  `}

  &:last-child button {
    border-right: none;
  }
`;

const Button = styled.button.attrs({
  type: 'button',
  className: classNames({
    'flex plain-button no-margin no-padding': true,
  }),
})``;

const ButtonInner = styled(Space).attrs({
  as: 'span',
  h: { size: 's', properties: ['padding-right', 'padding-left'] },
  className: classNames({
    'flex flex--v-center flex--h-center': true,
    [font('hnm', 5)]: true,
  }),
})<{ isActive: boolean }>`
  color: ${props => props.theme.color(props.isActive ? 'yellow' : 'pewter')};
`;

type Props = {
  activeId: string;
  hideLabels?: boolean;
  items: {
    id: string;
    icon: string;
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
              <Icon name={item.icon} extraClasses={'icon--currentColor'} />
              <span className={hideLabels ? 'visually-hidden' : undefined}>
                {item.label}
              </span>
            </ButtonInner>
          </Button>
        </Item>
      ))}
    </List>
  );
};

export default ToolbarSegmentedControl;
