import { FunctionComponent, SyntheticEvent } from 'react';
import { IconSvg } from '@weco/common/icons/types';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { PaletteColor } from '@weco/common/views/themes/config';
import Icon from '@weco/common/views/components/Icon/Icon';

const TypeItem = styled.li`
  flex: 0 0 100%;
  position: relative;
  min-height: 200px;
  ${props => props.theme.media('medium')`
        flex-basis: calc(50% - 25px);
      `}
`;

const TypeLink = styled.a<{ backgroundColor: PaletteColor }>`
  display: block;
  height: 100%;
  width: 100%;
  text-decoration: none;
  background: ${props => props.theme.color(props.backgroundColor)};

  &:hover {
    background: ${props => props.theme.color('neutral.400')};
  }
`;

type Props = {
  url: string;
  title: string;
  text: string;
  backgroundColor:
    | 'accent.lightSalmon'
    | 'accent.lightGreen'
    | 'accent.lightPurple'
    | 'accent.lightBlue';
  icon?: IconSvg;
  onClick?: (event: SyntheticEvent<HTMLAnchorElement>) => void;
};

const TypeOption: FunctionComponent<Props> = ({
  url,
  title,
  text,
  backgroundColor,
  icon,
  onClick,
}) => (
  <TypeItem>
    <TypeLink href={url} backgroundColor={backgroundColor} onClick={onClick}>
      <Space
        v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
        h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
      >
        <h2 className={font('wb', 3)}>{title}</h2>
        <p className={font('intr', 5)}>{text}</p>
        {icon && <Icon icon={icon} />}
      </Space>
    </TypeLink>
  </TypeItem>
);

export default TypeOption;
