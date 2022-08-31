import { FunctionComponent } from 'react';
import { font, classNames } from '../../../utils/classnames';
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
  className: classNames({
    [font('intr', 5)]: true,
  }),
}))<LinkOrSpanSpaceAttrs>`
  ${props =>
    props.addBorder &&
    `
    border-left: 1px solid ${props.theme.color('marble')};
  `}
`;

const LinkLabels: FunctionComponent<Props> = ({
  items,
  heading,
  icon,
}: Props) =>
  heading ? (
    <dl
      className={classNames({
        flex: true,
        'flex--wrap': true,
        'no-margin': true,
        [font('intb', 5)]: true,
      })}
    >
      <Space
        as="dt"
        h={{ size: 's', properties: ['margin-right'] }}
        className={classNames({
          flex: true,
        })}
      >
        {icon && (
          <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
            <Icon icon={icon} />
          </Space>
        )}
        {heading}
      </Space>
      {items.map(({ url, text }, i) => (
        <dd
          key={`${url || text}-${i}`}
          className={classNames({
            'no-margin': true,
          })}
        >
          <ItemText url={url || null} addBorder={i !== 0}>
            {text}
          </ItemText>
        </dd>
      ))}
    </dl>
  ) : (
    <ul
      className={classNames({
        flex: true,
        'plain-list': true,
        'flex--wrap': true,
        'no-margin': true,
        'no-padding': true,
        [font('intb', 5)]: true,
      })}
    >
      {items.map(({ url, text }, i) => (
        <li
          key={`${url || text}-${i}`}
          className={classNames({
            'no-margin': true,
          })}
        >
          <ItemText url={url || null} addBorder={i !== 0}>
            {text}
          </ItemText>
        </li>
      ))}
    </ul>
  );

export default LinkLabels;
