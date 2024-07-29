import { FunctionComponent, SyntheticEvent } from 'react';
import { IconSvg } from '@weco/common/icons/types';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { PaletteColor } from '@weco/common/views/themes/config';
import Icon from '@weco/common/views/components/Icon/Icon';
import { plainListStyles } from '@weco/common/views/components/styled/PlainList';
import { useToggles } from '@weco/common/server-data/Context';
import { arrow, speechToText } from '@weco/common/icons';

export const TypeList = styled(Space).attrs({
  $v: { size: 'l', properties: ['row-gap'] },
  $h: { size: 'l', properties: ['column-gap'] },
})`
  ${plainListStyles};
  display: grid;

  ${props => props.theme.media('medium')`
    grid-template-columns: 1fr 1fr;
  `}
`;

const TypeItem = styled.li<{ $egWork?: boolean }>`
  flex: 0 0 100%;
  position: relative;
  ${props => (props.$egWork ? '' : 'min-height: 200px;')}
  ${props => props.theme.media('medium')`
        flex-basis: calc(50% - 25px);
      `}
`;

const TypeLink = styled.a<{
  $backgroundColor: PaletteColor;
  $egWork?: boolean;
}>`
  display: block;
  height: 100%;
  width: 100%;
  text-decoration: none;
  ${props => (props.$egWork ? 'border-radius: 6px;' : '')}
  background: ${props => props.theme.color(props.$backgroundColor)};

  /** TODO confirm behaviour **/
  &:hover {
    background: ${props => props.theme.color('neutral.400')};
  }
`;

type Props = {
  url: string;
  title: string;
  text: string;
  backgroundColor:
    | 'warmNeutral.300'
    | 'accent.lightSalmon'
    | 'accent.lightGreen'
    | 'accent.lightPurple'
    | 'accent.lightBlue';

  icon?: IconSvg;
  hasTranscripts?: boolean;
  onClick?: (event: SyntheticEvent<HTMLAnchorElement>) => void;
};

const TypeOption: FunctionComponent<Props> = ({
  url,
  title,
  text,
  backgroundColor,
  icon,
  hasTranscripts,
  onClick,
}) => {
  const { egWork } = useToggles();

  return egWork ? (
    <TypeItem $egWork={egWork}>
      <TypeLink
        href={url}
        $backgroundColor="warmNeutral.300"
        $egWork
        onClick={onClick}
      >
        <Space
          $v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
          $h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
        >
          <h2 className={font('wb', 3)}>{title}</h2>
          {icon && (
            <Icon icon={icon} sizeOverride="height: 32px; width: 32px;" />
          )}
          {hasTranscripts && (
            <Space
              $h={{ size: 's', properties: ['margin-left'] }}
              style={{ display: 'inline' }}
            >
              <Icon
                icon={speechToText}
                sizeOverride="height: 32px; width: 32px;"
              />
            </Space>
          )}
          <div style={{ position: 'absolute', bottom: '10px', right: '15px' }}>
            <Icon icon={arrow} sizeOverride="height: 32px; width: 32px;" />
          </div>
        </Space>
      </TypeLink>
    </TypeItem>
  ) : (
    <TypeItem>
      <TypeLink href={url} $backgroundColor={backgroundColor} onClick={onClick}>
        <Space
          $v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
          $h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
        >
          <h2 className={font('wb', 3)}>{title}</h2>
          <p className={font('intr', 5)}>{text}</p>
          {icon && (
            <Icon icon={icon} sizeOverride="height: 32px; width: 32px;" />
          )}
        </Space>
      </TypeLink>
    </TypeItem>
  );
};

export default TypeOption;
