import { setCookie } from 'cookies-next';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import cookies from '@weco/common/data/cookies';
import { IconSvg } from '@weco/common/icons/types';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';
import Icon from '@weco/common/views/components/Icon/Icon';
import { plainListStyles } from '@weco/common/views/components/styled/PlainList';
import { useToggles } from '@weco/common/server-data/Context';
import { arrow } from '@weco/common/icons';
import RelevantGuideIcons from '@weco/content/components/ExhibitionGuideRelevantIcons';
import { ExhibitionGuideType } from '@weco/content/types/exhibition-guides';

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

  &:hover {
    ${props =>
      props.$egWork
        ? 'text-decoration: underline;'
        : `background: ${props.theme.color('neutral.400')};`}
  }
`;

const TypeIconsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

function cookieHandler(key: string, data: string) {
  // We set the cookie to expire in 8 hours (the maximum length of
  // time the galleries are open in a day)
  const options = {
    maxAge: 8 * 60 * 60,
    path: '/',
    secure: true,
  };
  setCookie(key, data, options);
}

// TODO Review how this can be streamlined when we move to the new EG models
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
  type: ExhibitionGuideType;
  icon?: IconSvg;
};

const TypeOption: FunctionComponent<Props> = ({
  url,
  title,
  text,
  backgroundColor,
  icon,
  type,
}) => {
  const { egWork } = useToggles();

  const onClick = () => {
    cookieHandler(cookies.exhibitionGuideType, type as string);
  };

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

          <TypeIconsWrapper>
            <RelevantGuideIcons types={[type]} />

            <Icon icon={arrow} sizeOverride="height: 32px; width: 32px;" />
          </TypeIconsWrapper>
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
