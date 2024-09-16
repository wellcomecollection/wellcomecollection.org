import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { IconSvg } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import { LabelField } from '@weco/content/model/label-field';

type InfoBoxItem = LabelField & {
  icon?: IconSvg;
};

type Props = PropsWithChildren<{
  title: string;
  items: InfoBoxItem[];
  headingClasses?: string;
}>;

const InfoContainer = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
})`
  background-color: ${props => props.theme.color('yellow')};
`;

export const InfoIconWrapper = styled(Space).attrs({
  className: font('intb', 4),
  $h: { size: 's', properties: ['margin-right'] },
})`
  float: left;
`;

const InfoBox: FunctionComponent<Props> = ({
  title,
  items,
  headingClasses = font('wb', 3),
  children,
}) => {
  return (
    <>
      <h2 className={headingClasses}>{title}</h2>
      <InfoContainer>
        {items.map(({ title, description, icon }, i) => (
          <div key={i}>
            {icon && (title || description) && (
              <InfoIconWrapper>
                <Icon icon={icon} />
              </InfoIconWrapper>
            )}
            {title && <h3 className={font('intb', 5)}>{title}</h3>}
            {description && (
              <Space
                $v={{ size: 'm', properties: ['margin-bottom'] }}
                className={font('intr', 5)}
              >
                <PrismicHtmlBlock html={description} />
              </Space>
            )}
          </div>
        ))}
        {children}
      </InfoContainer>
    </>
  );
};

export default InfoBox;
