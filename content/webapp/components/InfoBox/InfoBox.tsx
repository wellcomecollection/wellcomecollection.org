import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Icon from '@weco/common/views/components/Icon/Icon';
import { LabelField } from '@weco/common/model/label-field';
import Space from '@weco/common/views/components/styled/Space';
import { IconSvg } from '@weco/common/icons';

type InfoBoxItem = LabelField & {
  icon?: IconSvg;
};

type Props = {
  title: string;
  items: InfoBoxItem[];
  children: ReactNode;
};

const InfoContainer = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
})`
  background-color: ${props => props.theme.color('yellow')};
`;

const InfoBox: FC<Props> = ({ title, items, children }) => {
  return (
    <>
      <h2 className="h2">{title}</h2>
      <InfoContainer>
        {items.map(({ title, description, icon }, i) => (
          <div key={i}>
            {icon && (title || description) && (
              <Space
                h={{ size: 's', properties: ['margin-right'] }}
                className={`float-l ${font('intb', 4)}`}
              >
                <Icon icon={icon} />
              </Space>
            )}
            {title && <h3 className={font('intb', 5)}>{title}</h3>}
            {description && (
              <Space
                v={{ size: 'm', properties: ['margin-bottom'] }}
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
