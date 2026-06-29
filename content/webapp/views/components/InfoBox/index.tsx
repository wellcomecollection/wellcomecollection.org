import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { IconSvg } from '@weco/common/icons';
import { typography } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import { LabelField } from '@weco/content/model/label-field';

type InfoBoxItem = LabelField & {
  icon?: IconSvg;
};

type Props = PropsWithChildren<{
  title: string;
  items: InfoBoxItem[];
  hasBiggerHeading?: boolean;
}>;

const InfoContainer = styled(Space).attrs<{ 'data-color-scheme': 'light' }>({
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
  'data-color-scheme': 'light',
})`
  background-color: ${props => props.theme.color('yellow')};
`;

export const InfoIconWrapper = styled(Space).attrs({
  className: typography('body', 'lg', 'strong'),
  $h: { size: 'xs', properties: ['margin-right'] },
})`
  float: left;
`;

const InfoBox: FunctionComponent<Props> = ({
  title,
  items,
  hasBiggerHeading,
  children,
}) => {
  return (
    <div data-component="info-box">
      <h2
        className={
          hasBiggerHeading
            ? typography('heading', 'xl', 'strong', 'brand')
            : typography('heading', 'lg', 'strong', 'brand')
        }
      >
        {title}
      </h2>

      <InfoContainer>
        {items.map(({ title, description, icon }, i) => (
          <div key={i}>
            {icon && (title || description) && (
              <InfoIconWrapper>
                <Icon icon={icon} />
              </InfoIconWrapper>
            )}
            {title && (
              <h3 className={typography('body', 'md', 'strong')}>{title}</h3>
            )}
            {description && (
              <Space
                $v={{ size: 'sm', properties: ['margin-bottom'] }}
                className={typography('body', 'md', 'regular')}
              >
                <PrismicHtmlBlock html={description} />
              </Space>
            )}
          </div>
        ))}
        {children}
      </InfoContainer>
    </div>
  );
};

export default InfoBox;
