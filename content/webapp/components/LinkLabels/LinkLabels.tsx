import { FunctionComponent } from 'react';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
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

type LinkOrSpanSpaceAttrs = {
  url?: string;
  addBorder: boolean;
};

const ItemText = styled(Space).attrs<LinkOrSpanSpaceAttrs>(props => ({
  as: props.url ? 'a' : 'span',
  href: props.url || undefined,
  h: {
    size: 's',
    properties: [
      'margin-right',
      props.addBorder ? 'padding-left' : undefined,
    ].filter(Boolean),
  },
  className: font('intr', 5),
}))<LinkOrSpanSpaceAttrs>`
  ${props =>
    props.addBorder &&
    `
    border-left: 1px solid ${props.theme.color('neutral.500')};
  `}
`;

const PlainItemList = styled(PlainList).attrs({
  className: font('intb', 5),
})`
  display: flex;
  flex-wrap: wrap;
`;

const ListWithHeading = styled.dl.attrs({
  className: `${font('intr', 5)}`,
})`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
`;

const ListWithHeadingItem = styled(Space).attrs({
  h: { size: 'xs', properties: ['margin-right'] },
  as: 'dt',
})`
  display: flex;
`;

const LinkLabels: FunctionComponent<Props> = ({ items, heading, icon }) =>
  heading ? (
    <ListWithHeading>
      <ListWithHeadingItem>
        {icon && (
          <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
            <Icon icon={icon} />
          </Space>
        )}
        {heading}:
      </ListWithHeadingItem>
      {items.map(({ url, text }, i) => (
        <dd key={`${url || text}-${i}`} style={{ margin: 0 }}>
          <ItemText url={url} addBorder={i !== 0}>
            {text}
          </ItemText>
        </dd>
      ))}
    </ListWithHeading>
  ) : (
    <PlainItemList>
      {items.map(({ url, text }, i) => (
        <li key={`${url || text}-${i}`}>
          <ItemText url={url} addBorder={i !== 0}>
            {text}
          </ItemText>
        </li>
      ))}
    </PlainItemList>
  );

export default LinkLabels;
