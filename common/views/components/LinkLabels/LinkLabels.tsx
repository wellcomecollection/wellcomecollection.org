import { FunctionComponent } from 'react';
import { font } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';
import styled from 'styled-components';
import { IconSvg } from '@weco/common/icons';

type ItemProps = {
  url?: string | null;
  text: string;
};

type Props = {
  items: ItemProps[];
  heading?: string;
  icon?: IconSvg;
};

type LinkOrSpanSpaceAttrs = {
  url: string | null;
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
    border-left: 1px solid ${props.theme.newColor('neutral.500')};
  `}
`;

const LinkLabels: FunctionComponent<Props> = ({
  items,
  heading,
  icon,
}: Props) =>
  heading ? (
    <dl className={`flex flex--wrap no-margin ${font('intr', 5)}`}>
      <Space
        as="dt"
        h={{ size: 'xs', properties: ['margin-right'] }}
        className="flex"
      >
        {icon && (
          <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
            <Icon icon={icon} />
          </Space>
        )}
        {heading}:
      </Space>
      {items.map(({ url, text }, i) => (
        <dd key={`${url || text}-${i}`} className="no-margin">
          <ItemText url={url || null} addBorder={i !== 0}>
            {text}
          </ItemText>
        </dd>
      ))}
    </dl>
  ) : (
    <ul
      className={
        'flex plain-list flex--wrap no-margin no-padding' +
        ' ' +
        font('intb', 5)
      }
    >
      {items.map(({ url, text }, i) => (
        <li key={`${url || text}-${i}`} className="no-margin">
          <ItemText url={url || null} addBorder={i !== 0}>
            {text}
          </ItemText>
        </li>
      ))}
    </ul>
  );

export default LinkLabels;
