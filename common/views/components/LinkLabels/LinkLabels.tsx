import { FunctionComponent } from 'react';
import { font } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '../styled/Space';
import styled from 'styled-components';
import { IconSvg } from '@weco/common/icons';

type ItemProps = {
  url?: string;
  text: string;
};

type Props = {
  items: ItemProps[];
  heading?: string;
  icon?: IconSvg;
};

const List = styled(PlainList).attrs({
  className: font('intr', 5),
})`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
`;

const Heading = styled(Space).attrs({
  h: { size: 'xs', properties: ['margin-right'] },
  as: 'li',
})`
  display: flex;
`;

const IconWrapper = styled(Space).attrs({
  h: { size: 's', properties: ['margin-right'] },
  as: 'span',
})``;

const Item = styled.li`
  margin: 0;
`;

type LinkOrSpanSpaceAttrs = {
  url?: string;
  isFirst: boolean;
};

const ItemText = styled(Space).attrs<LinkOrSpanSpaceAttrs>(props => ({
  as: props.url ? 'a' : 'span',
  href: props.url,
  h: {
    size: 's',
    properties: props.isFirst
      ? ['margin-right']
      : ['margin-right', 'padding-left'],
  },
  className: font('intr', 5),
}))<LinkOrSpanSpaceAttrs>`
  ${props =>
    !props.isFirst &&
    `
    border-left: 1px solid ${props.theme.color('neutral.500')};
  `}
`;

const LinkLabels: FunctionComponent<Props> = ({ items, heading, icon }) => (
  <List>
    {heading && (
      <Heading>
        {icon && (
          <IconWrapper>
            <Icon icon={icon} />
          </IconWrapper>
        )}
        {heading}:
      </Heading>
    )}
    {items.map(({ url, text }, i) => (
      <Item key={`${url || text}-${i}`}>
        <ItemText url={url} isFirst={i === 0}>
          {text}
        </ItemText>
      </Item>
    ))}
  </List>
);

export default LinkLabels;
